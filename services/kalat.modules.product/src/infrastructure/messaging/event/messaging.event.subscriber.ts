import { IEvent } from '@nestjs/cqrs'
import { Injectable, OnApplicationBootstrap, Type } from '@nestjs/common'
import { KafkaConsumer } from '../kafka/kafka.consumer'
import { IProjectionHandler, PROJECTION_HANDLER_METADATA } from './projection.decorator'
import { DomainEvent } from '../../events-store/event-store.interface'
import { DiscoveryService, Reflector } from '@nestjs/core'

@Injectable()
export class MessagingEventSubscriber implements OnApplicationBootstrap {
  private eventsHandlers = new Map<Type<IEvent>, IProjectionHandler<IEvent>>()

  constructor(
    private readonly consumer: KafkaConsumer,
    private readonly discovery: DiscoveryService,
    private readonly reflector: Reflector,
  ) {}

  async onApplicationBootstrap() {
    this.registerProjections()
    await this.listen()
  }

  private registerProjections() {
    const providers = this.discovery.getProviders()

    for (const provider of providers) {
      if (!provider.metatype) continue
      if (!provider.instance) continue

      const meta = this.reflector.get(PROJECTION_HANDLER_METADATA, provider.instance.constructor)

      if (meta) {
        this.eventsHandlers.set(meta, provider.instance)
      }
    }
  }

  private async listen(): Promise<void> {
    await this.consumer.subscribe<DomainEvent>(
      { topic: /Event$/, fromBeginning: true },
      async ({ topic, content }) => {
        for (const [event, handler] of this.eventsHandlers.entries()) {
          if (event.name === topic) {
            await handler.handle({
              id: content.id,
              type: content.type,
              data: this.reconstructEvent(event, content.data),
              aggregateType: content.aggregateType,
              aggregateId: content.aggregateId,
              version: content.version,
              timestamp: new Date(content.timestamp),
            })
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
}
