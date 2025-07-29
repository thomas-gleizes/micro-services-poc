import { IEvent, IMessageSource } from '@nestjs/cqrs'
import { Subject } from 'rxjs'
import { Inject, Injectable } from '@nestjs/common'
import { KafkaConsumer } from '../kafka/kafka.consumer'
import { Serializable } from './message.interface'
import { DomainEventClass } from '../../domain/events/domain-event'

@Injectable()
export class MessagingEventSubscriber implements IMessageSource {
  private bridge: Subject<any>

  constructor(
    private readonly consumer: KafkaConsumer,
    @Inject('EVENTS') private readonly events: DomainEventClass[],
  ) {}

  async connect(): Promise<void> {
    await this.consumer.subscribe(
      { topic: /Event$/, fromBeginning: true },
      async ({ topic, message }) => {
        for (const event of this.events) {
          if (event.name === topic) {
            return this.bridge.next(event.deserialize(message as Serializable))
          }
        }
      },
    )
  }

  bridgeEventsTo<T extends IEvent>(subject: Subject<T>): any {
    this.bridge = subject
  }
}
