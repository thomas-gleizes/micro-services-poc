import { IQueryHandler, QueryHandler } from '@nestjs/cqrs'
import { PrismaService } from '../../../shared/prisma/prisma.service'
import { ReadProductQuery } from './read-product.query'
import { Inject } from '@nestjs/common'
import { PRODUCT_REPOSITORY, ProductRepository } from '../../../domain/repositories/product.repository'

@QueryHandler(ReadProductQuery)
export class ReadProductHandler implements IQueryHandler<ReadProductQuery> {
  constructor(
    @Inject(PRODUCT_REPOSITORY)
    private readonly productRepository: ProductRepository,
  ) {}

  execute(query: ReadProductQuery) {
    return this.productRepository.findById(query.productId)
  }
}
