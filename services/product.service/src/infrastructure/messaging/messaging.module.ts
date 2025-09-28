import { Module, OnModuleInit } from '@nestjs/common'
import { KafkaModule } from './kafka/kafka.module'
import { CqrsModule, EventBus, EventPublisher } from '@nestjs/cqrs'
import { ConfigModule } from '@nestjs/config'
import { DiscoveryModule } from '@nestjs/core'
import { MessagingEventSubscriber } from './event/messaging.event.subscriber'
import { MessagingEventPublisher } from './event/messaging-event.publisher'
import { productEvents } from '../../domain/events'
import { EVENT_STORE } from '../events-store/event-store.interface'
import { EventStore } from '../events-store/events-store'
import { TypeOrmModule } from '@nestjs/typeorm'
import { EventSchema } from '../schemas/event.schema'

@Module({
  imports: [
    KafkaModule,
    ConfigModule,
    DiscoveryModule,
    CqrsModule,
    TypeOrmModule.forFeature([EventSchema]),
  ],
  providers: [
    MessagingEventPublisher,
    MessagingEventSubscriber,
    {
      provide: 'EVENTS',
      useValue: [...productEvents],
    },
    {
      provide: EventPublisher,
      useClass: MessagingEventPublisher,
    },
    {
      provide: EVENT_STORE,
      useClass: EventStore,
    },
  ],
})
export class MessagingModule implements OnModuleInit {
  constructor(
    private readonly subscriber: MessagingEventSubscriber,
    private readonly publisher: MessagingEventPublisher,
    private readonly eventBus: EventBus,
  ) {}

  async onModuleInit() {
    this.subscriber.bridgeEventsTo(this.eventBus.subject$)

    // @ts-ignore
    this.eventBus.publisher = this.publisher

    await this.subscriber.connect()
  }
}
