import { Module } from '@nestjs/common'
import { ProductController } from './controllers/product.controller'
import { CreateProductHandler } from './commands/create-product/create-product.handler'
import { ReadProductHandler } from './queries/read-product/read-product.handler'
import { PrismaService } from '../services/prisma.service'
import { KafkaService } from 'src/kafka/kafka.service'
import { ProductCreatedConsumer } from './commands/create-product/create-product.consumer'
import { KafkaModule } from '../kafka/kafka.module'

@Module({
  imports: [KafkaModule],
  controllers: [ProductController],
  providers: [PrismaService, ReadProductHandler, CreateProductHandler, KafkaService, ProductCreatedConsumer],
})
export class ProductModule {}
