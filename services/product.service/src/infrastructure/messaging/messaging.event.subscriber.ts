import { IEvent, IMessageSource } from '@nestjs/cqrs'
import { Subject } from 'rxjs'
import { Inject, Injectable } from '@nestjs/common'
import { KafkaConsumer } from './kafka/kafka.consumer'

@Injectable()
export class MessagingEventSubscriber implements IMessageSource {
  private bridge: Subject<any>

  constructor(
    private readonly consumer: KafkaConsumer,
    @Inject('EVENTS') private readonly events: IEvent[],
  ) {}

  async connect(): Promise<void> {
    await this.consumer.subscribe(
      { topic: /Event$/, fromBeginning: true },
      async ({ topic, message }) => {
        for (const event of this.events) {
          if (event.constructor.name === topic) {
            // @ts-ignore
            return this.bridge.next(new event(...message))
          }
        }
      },
    )
  }

  bridgeEventsTo<T extends IEvent>(subject: Subject<T>): any {
    this.bridge = subject
  }
}
