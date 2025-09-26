import { Module } from '@nestjs/common'
import { CqrsModule } from '@nestjs/cqrs'
import { TypeOrmModule } from '@nestjs/typeorm'
import { ConfigModule } from '@nestjs/config'
import { ProductController } from '../../presentation/controllers/product.controller'
import { KafkaModule } from '../../infrastructure/messaging/kafka/kafka.module'
import { commandHandlers } from '../../applications/commands'
import { queryHandlers } from '../../applications/queries'
import { productEventHandlers } from '../../domain/events'
import { ProductMongoQueryRepository } from '../../infrastructure/repositories/product-mongo-query.repository'
import { PRODUCT_QUERY_REPOSITORY } from '../../domain/repositories/product-query.repository'
import { PRODUCT_COMMAND_REPOSITORY } from '../../domain/repositories/product-command-repository.interface'
import { ProductMongoCommandRepository } from '../../infrastructure/repositories/product-mongo-command.repository'
import { ProductSchema } from '../../infrastructure/schemas/product.schema'
import { ProductMapper } from '../../applications/mappers/product.mapper'
import { EVENT_STORE } from '../../infrastructure/events-store/event-store.interface'
import { EventStore } from '../../infrastructure/events-store/events-store'
import { EventSchema } from '../../infrastructure/schemas/event.schema'

@Module({
  imports: [
    KafkaModule,
    CqrsModule,
    ConfigModule,
    TypeOrmModule.forFeature([ProductSchema, EventSchema]),
  ],
  controllers: [ProductController],
  providers: [
    ProductMapper,
    {
      provide: PRODUCT_QUERY_REPOSITORY,
      useClass: ProductMongoQueryRepository,
    },
    {
      provide: PRODUCT_COMMAND_REPOSITORY,
      useClass: ProductMongoCommandRepository,
    },
    {
      provide: EVENT_STORE,
      useClass: EventStore,
    },
    ...commandHandlers,
    ...queryHandlers,
    ...productEventHandlers,
  ],
})
export class ProductModule {}
