import { Module, OnModuleInit, DynamicModule, Global } from '@nestjs/common'
import { KafkaModule } from './kafka/kafka.module'
import { QueryBus, CqrsModule, EventBus, EventPublisher, CommandBus } from '@nestjs/cqrs'
import { MessagingQueryBus } from './messaging-query.bus'
import { ConfigModule } from '@nestjs/config'
import { DiscoveryModule } from '@nestjs/core'
import { MessagingEventSubscriber } from './messaging.event.subscriber'
import { MessagingEventPublisher } from './messaging-event.publisher'
import { productEvents } from '../../domain/events'
import { MessagingCommandBus } from './messaging-command.bus'

@Global()
@Module({
  imports: [KafkaModule, ConfigModule, DiscoveryModule, CqrsModule],
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
    EventPublisher,
  ],
  exports: [EventPublisher, MessagingEventPublisher],
})
export class MessagingModule implements OnModuleInit {
  constructor(
    private readonly subscriber: MessagingEventSubscriber,
    private readonly eventPublisher: MessagingEventPublisher,
    private readonly eventBus: EventBus,
  ) {}

  async onModuleInit() {
    await this.subscriber.connect()
    this.subscriber.bridgeEventsTo(this.eventBus.subject$)

    await this.eventPublisher.connect()
    this.eventBus.publisher = this.eventPublisher
  }
}
