import { IQueryHandler, QueryHandler } from '@nestjs/cqrs'
import { ReadProductsQuery } from './read-products.query'
import { Inject } from '@nestjs/common'
import {
  IProductQueryRepository,
  PaginationResult,
  PRODUCT_QUERY_REPOSITORY,
  ReadProductModel,
} from '../../../domain/repositories/product-query-repository.interface'

@QueryHandler(ReadProductsQuery)
export class ReadProductsHandler
  implements IQueryHandler<ReadProductsQuery, PaginationResult<ReadProductModel>>
{
  constructor(
    @Inject(PRODUCT_QUERY_REPOSITORY)
    private readonly productRepository: IProductQueryRepository,
  ) {}

  execute(query: ReadProductsQuery): Promise<PaginationResult<ReadProductModel>> {
    return this.productRepository.findAll({}, { page: query.page, limit: query.limit })
  }
}
