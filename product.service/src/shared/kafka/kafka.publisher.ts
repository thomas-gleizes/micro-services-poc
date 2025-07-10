import { IEvent, IEventPublisher } from '@nestjs/cqrs'
import { Kafka, logLevel, Producer } from 'kafkajs'

export class KafkaPublisher implements IEventPublisher {
  private producer: Producer

  constructor() {
    this.producer = new Kafka({
      clientId: 'product_service_producer',
      brokers: ['event_bus:9092'],
      logLevel: logLevel.WARN,
    }).producer({ allowAutoTopicCreation: true })
  }

  async connect(): Promise<void> {
    await this.producer.connect()
  }

  publish(event: IEvent): any {
    this.producer.send({
      topic: event.constructor.name,
      messages: [{ value: JSON.stringify(event) }],
    })
  }
}
