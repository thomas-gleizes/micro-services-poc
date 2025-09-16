import { Module } from '@nestjs/common'
import { ProductController } from '../../presentation/controllers/product.controller'
import { KafkaModule } from '../kafka/kafka.module'
import { commandHandlers } from '../../applications/commands'
import { queryHandlers } from '../../applications/queries'
import { productEventHandlers } from '../../domain/events'
import { ConfigModule } from '@nestjs/config'
import { ProductMongoQueryRepository } from '../../infrastructure/repositories/product-mongo-query.repository'
import { PRODUCT_QUERY_REPOSITORY } from '../../domain/repositories/product-query.repository'
import { PRODUCT_COMMAND_REPOSITORY } from '../../domain/repositories/product-command.repository'
import { ProductMongoCommandRepository } from '../../infrastructure/repositories/product-mongo-command.repository'
import { TypeOrmModule } from '@nestjs/typeorm'
import { ProductSchema } from '../../infrastructure/schemas/product.schema'
import { ProductMapper } from '../../applications/mappers/product.mapper'

@Module({
  imports: [KafkaModule, ConfigModule, TypeOrmModule.forFeature([ProductSchema])],
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
    ...commandHandlers,
    ...queryHandlers,
    ...productEventHandlers,
  ],
})
export class ProductModule {}
