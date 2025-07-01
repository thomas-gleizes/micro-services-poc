import { Module } from '@nestjs/common'
import { ProductController } from './product.controller'
import { CreateProductHandler } from './commands/create-product/create-product.handler'
import { ReadProductHandler } from './queries/read-product/read-product.handler'
import { PrismaService } from '../services/prisma.service'
import { ProductCreatedConsumer } from './commands/create-product/create-product.consumer'
import { ReadProductsHandler } from './queries/read-prodcuts/read-products.handler'
import { UpdateProductConsumer } from './commands/update-product/update-product.consumer'
import { KafkaModule } from '../kafka/kafka.module'
import { CommandBus } from '@nestjs/cqrs'
import { KafkaCommandBus } from '../kafka/kafka-command-bus'

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
  ],
})
export class ProductModule {}
