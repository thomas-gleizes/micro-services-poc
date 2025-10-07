import { ProductAggregate } from '../aggregates/product.aggregate'
import { ProductId } from '../value-object/product-id.vo'

export const PRODUCT_COMMAND_REPOSITORY = Symbol('PRODUCT_COMMAND_REPOSITORY')

export interface IProductCommandRepository {
  findById(id: ProductId): Promise<ProductAggregate | null>

  save(aggregate: ProductAggregate): Promise<void>
}
