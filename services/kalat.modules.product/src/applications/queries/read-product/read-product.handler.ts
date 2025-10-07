import { IQueryHandler, QueryHandler } from '@nestjs/cqrs'
import { ReadProductQuery } from './read-product.query'
import { Inject } from '@nestjs/common'
import { ProductId } from '../../../domain/value-object/product-id.vo'
import { ProductNotFoundException } from '../../../domain/exceptions/product-not-found.exceptions'
import {
  IProductQueryRepository,
  PRODUCT_QUERY_REPOSITORY,
  ReadProductModel,
} from '../../../domain/repositories/product-query-repository.interface'

@QueryHandler(ReadProductQuery)
export class ReadProductHandler implements IQueryHandler<ReadProductQuery, ReadProductModel> {
  constructor(
    @Inject(PRODUCT_QUERY_REPOSITORY)
    private readonly productRepository: IProductQueryRepository,
  ) {}

  async execute(query: ReadProductQuery): Promise<ReadProductModel> {
    const productId = new ProductId(query.productId)
    const product = await this.productRepository.findById(productId)

    if (!product) throw new ProductNotFoundException()

    return product
  }
}
