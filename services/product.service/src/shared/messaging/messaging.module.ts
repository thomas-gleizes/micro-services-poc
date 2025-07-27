import { Module, OnModuleInit, DynamicModule, Global } from '@nestjs/common'
import { KafkaModule } from '../kafka/kafka.module'
import { QueryBus, CqrsModule, EventBus, EventPublisher } from '@nestjs/cqrs'
import { MessagingQueryBus } from './messaging-query.bus'
import { ConfigModule } from '@nestjs/config'
import { DiscoveryModule } from '@nestjs/core'
import { MessagingSubscriber } from './messaging.subscriber'
import { MessagingEventPublisher } from './messaging-event.publisher'
import { productEvents } from '../../domain/events'

@Global()
@Module({
  imports: [KafkaModule, ConfigModule, DiscoveryModule, CqrsModule],
  providers: [
    MessagingEventPublisher,
    MessagingSubscriber,
    {
      provide: QueryBus,
      useClass: MessagingQueryBus,
    },
    {
      provide: 'EVENTS',
      useValue: [...productEvents],
    },
    {
      provide: EventPublisher,
      useClass: MessagingEventPublisher,
    },
    EventPublisher,
  ],
  exports: [QueryBus, EventPublisher, MessagingEventPublisher],
})
export class MessagingModule implements OnModuleInit {
  constructor(
    private readonly subscriber: MessagingSubscriber,
    private readonly eventPublisher: MessagingEventPublisher,
    private readonly eventBus: EventBus,
  ) {}

  static forRoot(): DynamicModule {
    return {
      module: MessagingModule,
      imports: [CqrsModule.forRoot()],
      providers: [
        MessagingEventPublisher,
        MessagingSubscriber,
        {
          provide: QueryBus,
          useClass: MessagingQueryBus,
        },
        {
          provide: EventPublisher,
          useClass: MessagingEventPublisher,
        },
        {
          provide: 'EVENTS',
          useValue: [...productEvents],
        },
      ],
      exports: [QueryBus, EventPublisher, MessagingEventPublisher],
      global: true,
    }
  }

  async onModuleInit() {
    await this.subscriber.connect()
    this.subscriber.bridgeEventsTo(this.eventBus.subject$)

    await this.eventPublisher.connect()
    this.eventBus.publisher = this.eventPublisher
  }
}
