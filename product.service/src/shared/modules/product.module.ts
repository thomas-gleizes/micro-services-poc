import { Module } from '@nestjs/common'
import { ProductController } from '../../presentation/controllers/product.controller'
import { KafkaModule } from '../kafka/kafka.module'
import { PRODUCT_REPOSITORY } from '../../domain/repositories/product.repository'
import { ProductPrismaRepository } from '../../infrastructure/repositories/product-prisma.repositories'
import { commandHandlers } from '../../applications/commands'
import { queryHandlers } from '../../applications/queries'
import { productEventHandlers } from '../../domain/events'
import { PrismaModule } from '../prisma/prisma.module'
import { ConfigModule } from '@nestjs/config'

@Module({
  imports: [KafkaModule, PrismaModule, ConfigModule],
  controllers: [ProductController],
  providers: [
    {
      provide: PRODUCT_REPOSITORY,
      useClass: ProductPrismaRepository,
    },
    ...commandHandlers,
    ...queryHandlers,
    ...productEventHandlers,
  ],
})
export class ProductModule {}
