import { Inject, Logger, OnModuleDestroy, OnModuleInit } from '@nestjs/common'
import { Consumer, Kafka } from 'kafkajs'
import { ConfigService } from '@nestjs/config'

export type MessageHandler<Content> = (message: {
  topic: string
  content: Content
  metadata: { [key: string]: string }
}) => void | Promise<void>

export class KafkaConsumer implements OnModuleInit, OnModuleDestroy {
  private readonly _logger = new Logger('CONSUMER')
  private readonly consumer: Consumer
  private readonly handlers = new Map<string | RegExp, MessageHandler<any>>()

  constructor(@Inject('KAFKA_BROKER') broker: Kafka, config: ConfigService) {
    this._logger.debug('INSTANCY CONSUMER')
    this.consumer = broker.consumer({
      groupId: config.get<string>('KAFKA_CONSUMER_GROUP')!,
      allowAutoTopicCreation: false,
      retry: {
        retries: config.get<number>('KAFKA_CONSUMER_RETRIES'),
        initialRetryTime: config.get<number>('KAFKA_CONSUMER_INITIAL_RETRY_TIME'),
      },
    })
  }

  async onModuleInit() {
    await this.consumer.connect()
  }

  async onModuleDestroy() {
    await this.consumer.disconnect()
  }

  public async subscribe<Content>(
    options: {
      topic: string | RegExp
      fromBeginning?: boolean
    },
    handler: MessageHandler<Content>,
  ) {
    this.handlers.set(options.topic, handler)
    await this.consumer.subscribe({ topic: options.topic, fromBeginning: options.fromBeginning })
  }

  public async run() {
    await this.consumer.run({
      autoCommit: false,
      eachMessage: async ({ topic, message, partition }) => {
        try {
          this._logger.debug(topic)

          if (message.value) {
            const metadata = Object.fromEntries(
              Object.entries(message.headers || {}).map(([key, value]) => [
                key,
                Buffer.isBuffer(value) ? value.toString() : value ?? '',
              ]),
            ) as { [key: string]: string }

            const content = JSON.parse(message.value.toString()) as any

            for (const [key, handler] of this.handlers.entries()) {
              if (key === topic) await handler({ topic, content: content, metadata })

              if (typeof key === 'object' && (key as RegExp).test(topic)) {
                await handler({ topic, content: content, metadata })
              }
            }
          }

          await this.consumer.commitOffsets([
            {
              topic,
              partition,
              offset: (+message.offset + 1).toString(),
            },
          ])
          this._logger.debug(`${topic} COMMITED`)
        } catch (e) {
          this._logger.error(e)
        }
      },
    })
  }
}
