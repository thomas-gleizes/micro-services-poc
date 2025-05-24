import { Module } from '@nestjs/common'
import { ProductController } from './controllers/product.controller'
import { CreateProductHandler } from './commands/create-product/create-product.handler'
import { ReadProductHandler } from './queries/read-product/read-product.handler'
import { PrismaService } from '../services/prisma.service'

@Module({
  controllers: [ProductController],
  providers: [PrismaService, ReadProductHandler, CreateProductHandler],
})
export class ProductModule {}
