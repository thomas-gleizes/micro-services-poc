import { Module, OnModuleInit } from '@nestjs/common'
import { ProductController } from '../../presentation/controllers/product.controller'
import { KafkaModule } from '../kafka/kafka.module'
import { CqrsModule, EventBus } from '@nestjs/cqrs'
import { PRODUCT_REPOSITORY } from '../../domain/repositories/product.repository'
import { ProductPrismaRepository } from '../../infrastructure/repositories/product-prisma.repositories'
import { ProductCreatedEvent } from '../../domain/events/products/product-created/product-created.event'
import { ProductUpdatedEvent } from '../../domain/events/products/product-updated/product-updated.event'
import { ProductDeletedEvent } from '../../domain/events/products/product-deleted/product-deleted.event'
import { commandHandlers } from '../../applications/commands'
import { queryHandlers } from '../../applications/queries'
import { eventHandlers } from '../../domain/events'
import { ClientKafka } from '@nestjs/microservices'
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
    {
      provide: 'KAFKA_CLIENT',
      useFactory: () => {
        return new ClientKafka({
          client: {
            brokers: ['localhost:9092'],
          },
          consumer: {
            groupId: 'client-consumer',
          },
        })
      },
    },
    ...commandHandlers,
    ...queryHandlers,
    ...eventHandlers,
  ],
})
export class ProductModule {}
