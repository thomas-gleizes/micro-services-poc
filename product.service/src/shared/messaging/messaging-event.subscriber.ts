import { IEvent, IMessageSource } from '@nestjs/cqrs'
import { Subject } from 'rxjs'
import { Inject, Injectable } from '@nestjs/common'
import { KafkaConsumer } from '../kafka/kafka.consumer'
import { DomainEventClass } from '../../domain/events/domain-event'

@Injectable()
export class MessagingEventSubscriber implements IMessageSource {
  private bridge: Subject<any>

  constructor(
    private readonly consumer: KafkaConsumer,
    @Inject('EVENTS') private readonly events: Array<DomainEventClass>,
  ) {}

  async connect(): Promise<void> {
    await this.consumer.connect()

    for (const event of this.events) {
      await this.consumer.subscribe(event.name)
    }

    await this.consumer.run(async (topic, message) => {
      if (this.bridge) {
        for (const event of this.events) {
          if (event.name === topic) {
            this.bridge.next(event.deserialize(message.value))
          }
        }
      }
    })
  }

  bridgeEventsTo<T extends IEvent>(subject: Subject<T>): any {
    this.bridge = subject
  }
}
