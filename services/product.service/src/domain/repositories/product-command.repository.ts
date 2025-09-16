import { ProductProps } from '../entities/product.entity'
import { ProductAggregate } from '../aggregates/product.aggregate'
import { ProductId } from '../value-object/product-id.vo'

export const PRODUCT_COMMAND_REPOSITORY = Symbol('PRODUCT_COMMAND_REPOSITORY')

export interface ProductCommandRepository {
  findById(id: ProductId): Promise<ProductAggregate | null>

  save(product: ProductProps): Promise<ProductAggregate | null>

  update(id: ProductId, product: ProductProps): Promise<ProductAggregate | null>

  delete(id: ProductId): Promise<void>
}
