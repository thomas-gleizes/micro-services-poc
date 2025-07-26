import { IEvent, IMessageSource } from '@nestjs/cqrs'
import { Subject } from 'rxjs'
import { Inject, Injectable } from '@nestjs/common'
import { KafkaConsumer } from '../kafka/kafka.consumer'
import { Message, Serializable } from './message.interface'

@Injectable()
export class MessagingSubscriber implements IMessageSource {
  private bridge: Subject<any>

  constructor(
    private readonly consumer: KafkaConsumer,
    @Inject('EVENTS') private readonly events: (typeof Message<any>)[],
  ) {}

  async connect(): Promise<void> {
    await this.consumer.subscribe({ topic: /Event$/, fromBeginning: true }, async ({ topic, message }) => {
      for (const event of this.events) {
        if (event.name === topic) {
          this.bridge.next(event.deserialize(message as Serializable))
        }
      }
    })
  }

  bridgeEventsTo<T extends IEvent>(subject: Subject<T>): any {
    this.bridge = subject
  }
}
