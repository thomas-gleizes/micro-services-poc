import { IEvent } from '@nestjs/cqrs'
import { Inject, Injectable, Logger, OnModuleInit, Type } from '@nestjs/common'
import { KafkaConsumer } from '../../kafka/kafka.consumer'
import { IProjectionHandler, PROJECTION_HANDLER_METADATA } from './projection.decorator'
import { DiscoveryService, Reflector } from '@nestjs/core'
import { DomainEvent } from '../message.interface'
import { KAFKA_PROJECTION_CONSUMER } from '../../kafka/kafka.token'
import { MESSAGING_BASE } from '../messaging.token'

@Injectable()
export class MessagingProjectionSubscriber implements OnModuleInit {
  private readonly logger = new Logger('PROJECTION_SUBSCRIBER')
  private readonly eventsHandlers = new Map<Type<IEvent>, IProjectionHandler<IEvent>>()

  constructor(
    @Inject(KAFKA_PROJECTION_CONSUMER)
    private readonly consumer: KafkaConsumer,
    private readonly discovery: DiscoveryService,
    private readonly reflector: Reflector,
    @Inject(MESSAGING_BASE)
    private readonly messagingBase: string,
  ) {}

  async onModuleInit() {
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
    this.logger.log('Listen : ' + Array.from(this.eventsHandlers.keys()).map((event) => event.name))

    const base = `${this.messagingBase}.domain.`

    const regex = new RegExp(`${base.replaceAll('.', '\\.')}'.[A-Za-z0-9]+$'`)

    await this.consumer.subscribe<DomainEvent<any>>(
      { topic: regex, fromBeginning: true },
      async ({ topic, content }) => {
        for (const [event, handler] of this.eventsHandlers.entries()) {
          if (event.name === topic) {
            await handler.handle({
              id: content.id,
              type: content.content_type,
              payload: this.reconstructEvent(event, content.payload),
              aggregateType: content.content_type,
              aggregateId: content.aggregate_id,
              version: content.version,
              createdAt: new Date(content.created_at),
            })
          }
        }
      },
    )
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
