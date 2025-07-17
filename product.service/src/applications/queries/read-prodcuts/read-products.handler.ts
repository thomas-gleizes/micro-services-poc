import { IQueryHandler, QueryHandler } from '@nestjs/cqrs'
import { ReadProductsQuery } from './read-products.query'
import { Inject } from '@nestjs/common'
import { PRODUCT_REPOSITORY, ProductRepository } from '../../../domain/repositories/product.repository'

@QueryHandler(ReadProductsQuery)
export class ReadProductsHandler implements IQueryHandler<ReadProductsQuery> {
  constructor(
    @Inject(PRODUCT_REPOSITORY)
    private readonly productRepository: ProductRepository,
  ) {}

  execute(query: ReadProductsQuery): Promise<any> {
    return this.productRepository.findAll({})
  }
}
