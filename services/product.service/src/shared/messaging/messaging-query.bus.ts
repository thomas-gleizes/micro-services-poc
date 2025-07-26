import { IQuery, IQueryBus, IQueryHandler } from '@nestjs/cqrs'
import { Query } from '@nestjs/cqrs/dist/classes/query'
import { Injectable, Logger, OnModuleInit, Scope } from '@nestjs/common'
import { Message } from './message.interface'
import { KafkaProducer } from '../kafka/kafka.producer'
import { KafkaConsumer } from '../kafka/kafka.consumer'
import { randomUUID } from 'node:crypto'
import { EventEmitter } from 'node:events'
import { ReadProductsQueryReply } from '../../applications/queries/read-prodcuts/read-products.query'
import { ConfigService } from '@nestjs/config'
import { QueryTimeoutException } from './query-timeout.exception'
import { DiscoveryService, MetadataScanner } from '@nestjs/core'
import { QUERY_HANDLER_METADATA } from '@nestjs/cqrs/dist/decorators/constants'

export interface QueryBase extends IQuery, Message {}

@Injectable({ scope: Scope.DEFAULT })
export class MessagingQueryBus implements IQueryBus<QueryBase>, OnModuleInit {
  private readonly logger = new Logger(MessagingQueryBus.name)
  private readonly eventEmitter = new EventEmitter()
  private readonly queries = new Set<string>()
  private readonly handlers = new Map<String, IQueryHandler>()

  constructor(
    private readonly config: ConfigService,
    private readonly producer: KafkaProducer,
    private readonly consumer: KafkaConsumer,
    private readonly discoveryService: DiscoveryService,
  ) {}

  async onModuleInit() {
    await Promise.all([this.consumeQueries(), this.consumeReply(), this.producer.connect()])
    await this.consumer.run()

    this.retrieveQueryClass()
  }

  retrieveQueryClass() {
    const providers = this.discoveryService.getProviders()

    for (const wrapper of providers) {
      if (!wrapper.metatype) continue

      const queryHandlerMetaType = Reflect.getMetadata(QUERY_HANDLER_METADATA, wrapper.metatype)

      if (queryHandlerMetaType) this.handlers.set(queryHandlerMetaType.name, wrapper.instance)
    }
  }

  async consumeQueries() {
    await this.consumer.subscribe(
      { topic: /Query$/, fromBeginning: false },
      async ({ topic, message, metadata }) => {
        const queryId = metadata.queryId
        if (!queryId) return this.logger.warn(`${topic} : queryId not found in metadata`)

        const handler = this.handlers.get(topic)

        if (!handler) return this.logger.warn(`${topic} : Handler not found`)

        const result = await handler.execute(message)
        await this.producer.send(`${topic}Reply`, result, { queryId })
      },
    )
  }

  async consumeReply() {
    await this.consumer.subscribe(
      { topic: /QueryReply$/, fromBeginning: false },
      ({ topic, message, metadata }) => {
        const queryId = metadata.queryId
        if (!queryId) return this.logger.warn(`${topic}: queryId not found in metadata`)

        if (!this.queries.has(queryId)) return this.logger.warn(`${topic}: query is not register`)

        this.queries.delete(queryId)
        this.eventEmitter.emit(queryId, message)
      },
    )
  }

  async execute<TResult>(query: Query<TResult>): Promise<TResult> {
    if (!(query instanceof Message)) throw new Error('query must implement Message')

    const topic = query.constructor.name
    const queryId = randomUUID()

    const promise = new Promise<TResult>((resolve, reject) => {
      setTimeout(() => reject(new QueryTimeoutException()), this.config.get<number>('QUERY_TIMEOUT', 30_000))
      this.eventEmitter.once(queryId, resolve)
    })

    this.queries.add(queryId)

    promise.finally(() => this.queries.delete(queryId))

    await this.producer.send(topic, query.serialize(), { queryId })

    return promise
  }
}
