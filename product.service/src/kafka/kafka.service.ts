import { Consumer, Producer, Admin, EachMessageHandler, Kafka } from 'kafkajs'
import { Injectable, Inject, OnModuleInit, OnModuleDestroy, LoggerService, Logger } from '@nestjs/common'

@Injectable()
export class KafkaService implements OnModuleDestroy, OnModuleInit {
  private readonly _logger = new Logger(KafkaService.name)
  private readonly _consumers: Map<string | RegExp, Consumer> = new Map()
  private readonly _producer: Producer

  constructor(@Inject('KAFKA_CONNECTION') private readonly kafka: Kafka) {
    this._producer = this.kafka.producer({ allowAutoTopicCreation: true })
  }

  async onModuleInit() {
    await this._producer.connect()
  }

  async onModuleDestroy() {
    return Promise.allSettled([
      this._producer.disconnect(),
      Array.from(this._consumers.values()).map((consumer) => consumer.disconnect()),
    ])
  }

  async publish(topic: string, message: any) {
    this._logger.debug(`New event to ${topic} : ${message}`)
    await this._producer.send({
      topic,
      messages: [{ value: JSON.stringify(message) }],
    })
  }

  async consume<Message = unknown>(
    topic: string | RegExp,
    handler: (payload: Message) => Promise<void> | void,
  ) {
    if (this._consumers.has(topic)) {
      this._logger.warn(`Consumer for topic ${topic} already exists`)
      return this._consumers.get(topic)
    }

    this._logger.debug(`Creating consumer for topic ${topic}`)
    const consumer = this.kafka.consumer({
      groupId: `default-group-${topic}`,
      allowAutoTopicCreation: true,
    })

    await consumer.connect()
    await consumer.subscribe({ topic, fromBeginning: true })
    this._consumers.set(topic, consumer)
    this._logger.debug(`Consumer for topic ${topic} created successfully`)

    await consumer.run({
      eachMessage: async (payload) => {
        this._logger.debug(`Received message on topic ${topic}`)
        return handler(JSON.parse(payload.message.value!.toString()))
      },
    })
  }
}
