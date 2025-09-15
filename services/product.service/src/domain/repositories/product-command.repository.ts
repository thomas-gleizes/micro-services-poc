import { ProductProps } from '../entities/product.entity'
import { ProductAggregate } from '../aggregates/product.aggregate'

export const PRODUCT_COMMAND_REPOSITORY = Symbol('PRODUCT_COMMAND_REPOSITORY')

export interface ProductCommandRepository {
  findById(id: string): Promise<ProductAggregate | null>

  save(product: ProductProps): Promise<ProductAggregate | null>

  update(id: string, product: ProductProps): Promise<ProductAggregate | null>

  delete(id: string): Promise<void>
}
