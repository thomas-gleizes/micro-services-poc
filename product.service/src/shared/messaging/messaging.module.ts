import { Module, OnModuleInit } from '@nestjs/common'
import { KafkaModule } from '../kafka/kafka.module'
import { CqrsModule, EventBus } from '@nestjs/cqrs'
import { MessagingEventPublisher } from './messaging-event.publisher'
import { MessagingEventSubscriber } from './messaging-event.subscriber'
import { ProductCreatedEvent } from '../../domain/events/products/product-created/product-created.event'
import { ProductUpdatedEvent } from '../../domain/events/products/product-updated/product-updated.event'
import { ProductDeletedEvent } from '../../domain/events/products/product-deleted/product-deleted.event'

@Module({
  imports: [KafkaModule, CqrsModule],
  providers: [
    MessagingEventPublisher,
    MessagingEventSubscriber,
    {
      provide: 'EVENTS',
      useValue: [ProductCreatedEvent, ProductUpdatedEvent, ProductDeletedEvent],
    },
  ],
})
export class MessagingModule implements OnModuleInit {
  constructor(
    private readonly eventBus: EventBus,
    private readonly publisher: MessagingEventPublisher,
    private readonly subscriber: MessagingEventSubscriber,
  ) {}

  async onModuleInit() {
    await this.subscriber.connect()
    this.subscriber.bridgeEventsTo(this.eventBus.subject$)

    await this.publisher.connect()
    this.eventBus.publisher = this.publisher
  }
}
