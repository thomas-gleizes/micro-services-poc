import { Module, OnModuleInit } from '@nestjs/common'
import { ProductController } from '../../presentation/controllers/product.controller'
import { KafkaModule } from '../kafka/kafka.module'
import { CqrsModule, EventBus } from '@nestjs/cqrs'
import { PRODUCT_REPOSITORY } from '../../domain/repositories/product.repository'
import { ProductPrismaRepository } from '../../infrastructure/repositories/product-prisma.repositories'
import { KafkaPublisher } from '../kafka/kafka.publisher'
import { KafkaSubscriber } from '../kafka/kafka.subscriber'
import { ProductCreatedEvent } from '../../domain/events/products/product-created/product-created.event'
import { ProductUpdatedEvent } from '../../domain/events/products/product-updated/product-updated.event'
import { ProductDeletedEvent } from '../../domain/events/products/product-deleted/product-deleted.event'
import { commandHandlers } from '../../applications/commands'
import { queryHandlers } from '../../applications/queries'
import { eventHandlers } from '../../domain/events'

@Module({
  imports: [KafkaModule, CqrsModule],
  controllers: [ProductController],
  providers: [
    {
      provide: PRODUCT_REPOSITORY,
      useClass: ProductPrismaRepository,
    },
    {
      provide: 'EVENTS',
      useValue: [ProductCreatedEvent, ProductUpdatedEvent, ProductDeletedEvent],
    },
    ...commandHandlers,
    ...queryHandlers,
    ...eventHandlers,
    KafkaPublisher,
    KafkaSubscriber,
  ],
})
export class ProductModule implements OnModuleInit {
  constructor(
    private readonly event$: EventBus,
    private readonly kafkaPublisher: KafkaPublisher,
    private readonly kafkaSubscriber: KafkaSubscriber,
  ) {}

  async onModuleInit(): Promise<any> {
    await this.kafkaSubscriber.connect()
    this.kafkaSubscriber.bridgeEventsTo(this.event$.subject$)

    await this.kafkaPublisher.connect()
    this.event$.publisher = this.kafkaPublisher
  }
}
