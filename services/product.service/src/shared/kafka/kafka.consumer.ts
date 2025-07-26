import { Inject, Logger, OnModuleDestroy, OnModuleInit } from '@nestjs/common'
import { Consumer, Kafka } from 'kafkajs'
import { Serializable } from '../messaging/message.interface'

type MessageHandler = (message: {
  topic: string
  message: Serializable
  metadata: { [key: string]: string }
}) => void | Promise<void>

export class KafkaConsumer implements OnModuleInit, OnModuleDestroy {
  private readonly _logger = new Logger('CONSUMER')
  private readonly consumer: Consumer
  private readonly handlers = new Map<string | RegExp, MessageHandler>()

  constructor(@Inject('KAFKA_BROKER') broker: Kafka) {
    this._logger.debug('INSTANCY CONSUMER')
    this.consumer = broker.consumer({
      groupId: 'questionnaire-service',
      allowAutoTopicCreation: true,
    })
  }

  async onModuleInit() {
    await this.consumer.connect()
  }

  async onModuleDestroy() {
    await this.consumer.disconnect()
  }

  public async subscribe(
    options: {
      topic: string | RegExp
      fromBeginning?: boolean
    },
    handler: MessageHandler,
  ) {
    await this.consumer.stop()
    this.handlers.set(options.topic, handler)
    await this.consumer.subscribe({ topic: options.topic, fromBeginning: options.fromBeginning })
    await this.consumer.run()
  }

  public async run() {
    await this.consumer.stop()
    await this.consumer.run({
      eachMessage: async ({ topic, message }) => {
        this._logger.debug(topic)
        if (!message.value) return

        const metadata = Object.fromEntries(
          Object.entries(message.headers || {}).map(([key, value]) => [
            key,
            Buffer.isBuffer(value) ? value.toString() : value ?? '',
          ]),
        ) as { [key: string]: string }

        const deserializeMessage = JSON.parse(message.value.toString()) as Serializable

        for (const [key, handler] of this.handlers.entries()) {
          if (key === topic) await handler({ topic, message: deserializeMessage, metadata })

          if (typeof key === 'object' && (key as RegExp).test(topic)) {
            await handler({ topic, message: deserializeMessage, metadata })
          }
        }
      },
    })
  }
}
