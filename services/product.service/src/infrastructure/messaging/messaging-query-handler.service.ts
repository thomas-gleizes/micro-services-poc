import { IQueryHandler } from '@nestjs/cqrs'
import { Injectable, Logger, OnModuleInit, Scope } from '@nestjs/common'
import { KafkaProducer } from './kafka/kafka.producer'
import { KafkaConsumer } from './kafka/kafka.consumer'
import { DiscoveryService } from '@nestjs/core'
import { QUERY_HANDLER_METADATA } from '@nestjs/cqrs/dist/decorators/constants'

@Injectable({ scope: Scope.DEFAULT })
export class MessagingQueryHandler implements OnModuleInit {
  private readonly logger = new Logger(MessagingQueryHandler.name)
  private readonly handlers = new Map<String, IQueryHandler>()

  constructor(
    private readonly producer: KafkaProducer,
    private readonly consumer: KafkaConsumer,
    private readonly discoveryService: DiscoveryService,
  ) {}

  async onModuleInit() {
    await Promise.all([this.consumeQueries(), this.producer.connect()])
    await this.consumer.run()

    this.retrieveQueryHandlers()
  }

  retrieveQueryHandlers() {
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
}
