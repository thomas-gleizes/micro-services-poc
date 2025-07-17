import { Kafka, Producer } from 'kafkajs'
import { Inject, Injectable } from '@nestjs/common'

@Injectable()
export class KafkaProducer {
  private readonly producer: Producer

  constructor(@Inject('KAFKA_BROKER') broker: Kafka) {
    this.producer = broker.producer({ allowAutoTopicCreation: true })
  }

  async connect() {
    await this.producer.connect()
  }

  async send<T = unknown>(topic: string, message: T) {
    await this.producer.send({
      topic: topic,
      messages: [{ value: JSON.stringify(message) }],
    })
  }
}
