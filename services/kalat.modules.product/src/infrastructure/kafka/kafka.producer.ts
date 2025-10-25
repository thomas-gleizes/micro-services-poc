import { Kafka, Producer } from 'kafkajs'
import { Inject, Injectable, Logger } from '@nestjs/common'
import { Message } from '../messaging/message.interface'
import { KAFKA_BROKER } from './kafka.token'

@Injectable()
export class KafkaProducer {
  private readonly _logger = new Logger('PRODUCER')

  private readonly producer: Producer

  constructor(@Inject(KAFKA_BROKER) broker: Kafka) {
    this.producer = broker.producer({ allowAutoTopicCreation: true })
  }

  connect() {
    return this.producer.connect()
  }

  disconnect() {
    return this.producer.disconnect()
  }

  async send<M extends Message<any, any>>(topic: string, messages: M[], partitionKey: string) {
    this._logger.debug(topic)

    await this.producer.send({
      topic: topic,
      messages: messages.map((message) => ({ key: partitionKey, value: JSON.stringify(message) })),
    })
  }
}
