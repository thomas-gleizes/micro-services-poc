import { Kafka, Producer } from 'kafkajs'
import { Inject, Injectable, Logger } from '@nestjs/common'

@Injectable()
export class KafkaProducer {
  private readonly _logger = new Logger('PRODUCER')

  private readonly producer: Producer

  constructor(@Inject('KAFKA_BROKER') broker: Kafka) {
    this.producer = broker.producer({ allowAutoTopicCreation: true })
  }

  async connect() {
    await this.producer.connect()
  }

  async send<T = unknown>(topic: string, message: T, metadata?: Record<string, string>) {
    this._logger.debug(topic)
    await this.producer.send({
      topic: topic,
      messages: [{ value: JSON.stringify(message), headers: metadata }],
    })
  }
}
