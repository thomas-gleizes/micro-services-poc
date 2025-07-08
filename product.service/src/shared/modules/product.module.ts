import { Module } from '@nestjs/common'
import { ProductController } from '../../presentation/controllers/product.controller'
import { CreateProductHandler } from '../../applications/commands/create-product/create-product.handler'
import { ReadProductHandler } from '../../applications/queries/read-product/read-product.handler'
import { PrismaService } from '../services/prisma.service'
import { ProductCreatedConsumer } from '../../applications/commands/create-product/create-product.consumer'
import { ReadProductsHandler } from '../../applications/queries/read-prodcuts/read-products.handler'
import { UpdateProductConsumer } from '../../applications/commands/update-product/update-product.consumer'
import { KafkaModule } from '../kafka/kafka.module'
import { CommandBus } from '@nestjs/cqrs'
import { KafkaCommandBus } from '../kafka/kafka-command-bus'
import { PRODUCT_REPOSITORY } from '../../domain/repositories/product.repository'
import { ProductPrismaRepository } from '../../infrastructure/repositories/product-prisma.repositories'

@Module({
  imports: [KafkaModule],
  controllers: [ProductController],
  providers: [
    PrismaService,
    ReadProductHandler,
    ReadProductsHandler,
    CreateProductHandler,
    ProductCreatedConsumer,
    UpdateProductConsumer,
    {
      provide: CommandBus,
      useClass: KafkaCommandBus,
    },
    {
      provide: PRODUCT_REPOSITORY,
      useClass: ProductPrismaRepository,
    },
  ],
})
export class ProductModule {}
