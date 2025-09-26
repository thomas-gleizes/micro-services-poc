import { Module, OnModuleInit, DynamicModule, Global } from '@nestjs/common'
import { KafkaModule } from './kafka/kafka.module'
import { QueryBus, CqrsModule, EventBus, EventPublisher, CommandBus } from '@nestjs/cqrs'
import { MessagingQueryHandler } from './messaging-query-handler.service'
import { ConfigModule } from '@nestjs/config'
import { DiscoveryModule } from '@nestjs/core'
import { MessagingEventSubscriber } from './messaging.event.subscriber'
import { MessagingEventPublisher } from './messaging-event.publisher'
import { productEvents } from '../../domain/events'
import { MessagingCommandHandler } from './messaging-command-handler.service'

@Module({
  imports: [KafkaModule, ConfigModule, DiscoveryModule, CqrsModule],
  providers: [
    MessagingEventPublisher,
    MessagingEventSubscriber,
    MessagingQueryHandler,
    {
      provide: 'EVENTS',
      useValue: [...productEvents],
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
    await this.subscriber.connect()
    this.subscriber.bridgeEventsTo(this.eventBus.subject$)

    await this.publisher.connect()
    this.eventBus.publisher = this.publisher

    await this.subscriber.connect()
  }
}
