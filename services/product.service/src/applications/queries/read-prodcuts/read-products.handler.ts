import { IQueryHandler, QueryHandler } from '@nestjs/cqrs'
import { ReadProductsQuery } from './read-products.query'
import { Inject } from '@nestjs/common'
import {
  PaginationResult,
  PRODUCT_QUERY_REPOSITORY,
  ProductQueryRepository,
  ReadProduct,
} from '../../../domain/repositories/product-query.repository'

@QueryHandler(ReadProductsQuery)
export class ReadProductsHandler implements IQueryHandler<ReadProductsQuery> {
  constructor(
    @Inject(PRODUCT_QUERY_REPOSITORY)
    private readonly productRepository: ProductQueryRepository,
  ) {}

  execute(query: ReadProductsQuery): Promise<PaginationResult<ReadProduct>> {
    return this.productRepository.findAll({}, { page: query.page, limit: query.limit })
  }
}
