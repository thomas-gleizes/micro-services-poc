import { IEvent, IEventPublisher } from '@nestjs/cqrs'
import { KafkaProducer } from './kafka/kafka.producer'
import { Injectable, Logger } from '@nestjs/common'

@Injectable()
export class MessagingEventPublisher implements IEventPublisher {
  private readonly logger = new Logger('PUBLISHER')

  constructor(private readonly publisher: KafkaProducer) {}

  async connect() {
    await this.publisher.connect()
  }

  publish<TEvent extends IEvent>(event: TEvent): any {
    const topic = event.constructor.name
    this.logger.debug(topic)

    // @ts-ignore
    return this.publisher.send(topic, [...event])
  }
}
