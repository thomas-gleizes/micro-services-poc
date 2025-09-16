import { IQueryHandler, QueryHandler } from '@nestjs/cqrs'
import { ReadProductQuery } from './read-product.query'
import { Inject } from '@nestjs/common'
import {
  PRODUCT_QUERY_REPOSITORY,
  ProductQueryRepository,
  ReadProductModel,
} from '../../../domain/repositories/product-query.repository'
import { ProductId } from '../../../domain/value-object/product-id.vo'
import { ProductNotFoundException } from '../../../domain/exceptions/product-not-found.exceptions'

@QueryHandler(ReadProductQuery)
export class ReadProductHandler implements IQueryHandler<ReadProductQuery> {
  constructor(
    @Inject(PRODUCT_QUERY_REPOSITORY)
    private readonly productRepository: ProductQueryRepository,
  ) {}

  async execute(query: ReadProductQuery): Promise<ReadProductModel> {
    const productId = new ProductId(query.productId)
    const product = await this.productRepository.findById(productId)

    if (!product) throw new ProductNotFoundException()

    return product
  }
}
