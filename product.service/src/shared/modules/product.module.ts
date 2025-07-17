import { Module } from '@nestjs/common'
import { ProductController } from '../../presentation/controllers/product.controller'
import { KafkaModule } from '../kafka/kafka.module'
import { CqrsModule } from '@nestjs/cqrs'
import { PRODUCT_REPOSITORY } from '../../domain/repositories/product.repository'
import { ProductPrismaRepository } from '../../infrastructure/repositories/product-prisma.repositories'
import { ProductCreatedEvent } from '../../domain/events/products/product-created/product-created.event'
import { ProductUpdatedEvent } from '../../domain/events/products/product-updated/product-updated.event'
import { ProductDeletedEvent } from '../../domain/events/products/product-deleted/product-deleted.event'
import { commandHandlers } from '../../applications/commands'
import { queryHandlers } from '../../applications/queries'
import { productEventHandlers } from '../../domain/events'
import { PrismaModule } from '../prisma/prisma.module'

@Module({
  imports: [KafkaModule, CqrsModule, PrismaModule],
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
    ...productEventHandlers,
  ],
})
export class ProductModule {}
