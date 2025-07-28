import { Command, ICommand, ICommandBus, IQueryHandler } from '@nestjs/cqrs'
import { Injectable, Logger, OnModuleInit, Scope } from '@nestjs/common'
import { Message } from './message.interface'
import { KafkaProducer } from '../kafka/kafka.producer'
import { KafkaConsumer } from '../kafka/kafka.consumer'
import { randomUUID } from 'node:crypto'
import { EventEmitter } from 'node:events'
import { ConfigService } from '@nestjs/config'
import { QueryTimeoutException } from './query-timeout.exception'
import { DiscoveryService } from '@nestjs/core'
import { COMMAND_HANDLER_METADATA } from '@nestjs/cqrs/dist/utils/constants'

@Injectable({ scope: Scope.DEFAULT })
export class MessagingCommandBus implements ICommandBus<ICommand>, OnModuleInit {
  private readonly logger = new Logger(MessagingCommandBus.name)
  private readonly eventEmitter = new EventEmitter()
  private readonly commands = new Set<string>()
  private readonly handlers = new Map<String, IQueryHandler>()

  constructor(
    private readonly config: ConfigService,
    private readonly producer: KafkaProducer,
    private readonly consumer: KafkaConsumer,
    private readonly discoveryService: DiscoveryService,
  ) {}

  async onModuleInit() {
    await Promise.all([this.consumeCommands(), this.consumeReply(), this.producer.connect()])
    await this.consumer.run()

    this.retrieveCommandClass()
  }

  retrieveCommandClass() {
    const providers = this.discoveryService.getProviders()

    for (const wrapper of providers) {
      if (!wrapper.metatype) continue

      const commandHandlerMetaType = Reflect.getMetadata(COMMAND_HANDLER_METADATA, wrapper.metatype)

      if (commandHandlerMetaType) this.handlers.set(commandHandlerMetaType.name, wrapper.instance)
    }
  }

  async consumeCommands() {
    await this.consumer.subscribe(
      { topic: /Command$/, fromBeginning: false },
      async ({ topic, message, metadata }) => {
        const commandId = metadata.commandId
        if (!commandId) throw new Error(`${topic} : commandId not found in metadata`)

        const handler = this.handlers.get(topic)
        if (!handler) throw new Error(`${topic} : Handler not found`)

        const result = await handler.execute(message)
        await this.producer.send(`${topic}Reply`, result, { commandId })
      },
    )
  }

  async consumeReply() {
    await this.consumer.subscribe(
      { topic: /CommandReply$/, fromBeginning: false },
      ({ topic, message, metadata }) => {
        const commandId = metadata.commandId
        if (!commandId) throw new Error(`${topic}: commandId not found in metadata`)

        if (!this.commands.has(commandId)) throw new Error(`${topic}: query is not register`)

        this.commands.delete(commandId)
        this.eventEmitter.emit(commandId, message)
      },
    )
  }

  async execute<TResult>(command: Command<TResult>): Promise<TResult> {
    if (!(command instanceof Message)) throw new Error('query must implement Message')

    const topic = command.constructor.name
    const commandId = randomUUID()

    const promise = new Promise<TResult>((resolve, reject) => {
      setTimeout(
        () => reject(new QueryTimeoutException()),
        this.config.get<number>('QUERY_TIMEOUT', 30_000),
      )
      this.eventEmitter.once(commandId, resolve)
    })

    this.commands.add(commandId)

    promise.finally(() => this.commands.delete(commandId))

    await this.producer.send(topic, command.serialize(), { commandId })

    return promise
  }
}
