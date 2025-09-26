import { IQueryHandler } from '@nestjs/cqrs'
import { Injectable, OnModuleInit, Scope } from '@nestjs/common'
import { KafkaProducer } from './kafka/kafka.producer'
import { KafkaConsumer } from './kafka/kafka.consumer'
import { ConfigService } from '@nestjs/config'
import { DiscoveryService } from '@nestjs/core'
import { COMMAND_HANDLER_METADATA } from '@nestjs/cqrs/dist/utils/constants'

@Injectable({ scope: Scope.DEFAULT })
export class MessagingCommandBus implements OnModuleInit {
  private readonly handlers = new Map<String, IQueryHandler>()

  constructor(
    private readonly config: ConfigService,
    private readonly producer: KafkaProducer,
    private readonly consumer: KafkaConsumer,
    private readonly discoveryService: DiscoveryService,
  ) {}

  async onModuleInit() {
    await Promise.all([this.consumeCommands(), this.producer.connect()])
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
}
