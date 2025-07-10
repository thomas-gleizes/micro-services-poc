import { Module } from '@nestjs/common'
import { ConfigModule } from '@nestjs/config'
import { KafkaPublisher } from './kafka.publisher'
import { KafkaSubscriber } from './kafka.subscriber'
import { ProductCreatedEvent } from '../../domain/events/products/product-created/product-created.event'
import { ProductUpdatedEvent } from '../../domain/events/products/product-updated/product-updated.event'
import { ProductDeletedEvent } from '../../domain/events/products/product-deleted/product-deleted.event'

@Module({
  imports: [ConfigModule.forRoot()],
  providers: [
    KafkaSubscriber,
    KafkaPublisher,
    {
      provide: 'EVENTS',
      useValue: [ProductCreatedEvent, ProductUpdatedEvent, ProductDeletedEvent],
    },
  ],
  exports: [KafkaPublisher, KafkaSubscriber],
})
export class KafkaModule {}
