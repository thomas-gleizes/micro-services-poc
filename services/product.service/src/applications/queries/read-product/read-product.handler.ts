import { IQueryHandler, QueryHandler } from '@nestjs/cqrs'
import { ReadProductQuery } from './read-product.query'
import { Inject } from '@nestjs/common'
import {
  PRODUCT_QUERY_REPOSITORY,
  ProductQueryRepository,
  ReadProduct,
} from '../../../domain/repositories/product-query.repository'

@QueryHandler(ReadProductQuery)
export class ReadProductHandler implements IQueryHandler<ReadProductQuery> {
  constructor(
    @Inject(PRODUCT_QUERY_REPOSITORY)
    private readonly productRepository: ProductQueryRepository,
  ) {}

  execute(query: ReadProductQuery): Promise<ReadProduct> {
    return this.productRepository.findById(query.productId)
  }
}
