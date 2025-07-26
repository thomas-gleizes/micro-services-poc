import { IEvent, IEventPublisher } from '@nestjs/cqrs'
import { KafkaProducer } from '../kafka/kafka.producer'
import { DomainEvent } from '../../domain/events/domain-event'
import { Injectable } from '@nestjs/common'

@Injectable()
export class MessagingEventPublisher implements IEventPublisher {
  constructor(private readonly publisher: KafkaProducer) {}

  async connect() {
    await this.publisher.connect()
  }

  publish<TEvent extends IEvent>(event: TEvent): any {
    const topic = event.constructor.name

    if (event instanceof DomainEvent) {
      return this.publisher.send(topic, event.serialize())
    }

    throw new Error('Cannot publish not serialised event')
  }
}
