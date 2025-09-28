import { IEvent, IMessageSource } from '@nestjs/cqrs'
import { Subject } from 'rxjs'
import { Inject, Injectable, Logger, Type } from '@nestjs/common'
import { KafkaConsumer } from '../kafka/kafka.consumer'
import { EventData } from '../../events-store/event-store.interface'

@Injectable()
export class MessagingEventSubscriber implements IMessageSource {
  private bridge: Subject<any>

  constructor(
    private readonly consumer: KafkaConsumer,
    @Inject('EVENTS') private readonly events: Type<IEvent>[],
  ) {}

  async connect(): Promise<void> {
    await this.consumer.subscribe(
      { topic: /Event$/, fromBeginning: true },
      async ({ topic, message }) => {
        for (const event of this.events) {
          if (event.name === topic) {
            const { payload } = message as EventData
            const reconstructedEvent = this.reconstructEvent(event, payload)

            return this.bridge.next(reconstructedEvent)
          }
        }
      },
    )

    await this.consumer.run()
  }

  private reconstructEvent(EventClass: Type<IEvent>, payload: any): IEvent {
    // Si le payload contient déjà tous les paramètres nécessaires
    if (typeof payload === 'object' && payload !== null) {
      // Utiliser Object.assign pour créer une nouvelle instance avec les bonnes propriétés
      return Object.assign(Object.create(EventClass.prototype), payload)
    }

    // Sinon, utiliser le constructeur normal
    return new EventClass(payload)
  }

  bridgeEventsTo<T extends IEvent>(subject: Subject<T>): any {
    this.bridge = subject
  }
}
