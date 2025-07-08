import { ProductPrimitives } from '../entities/product.aggregate'
import { ProductStatus } from '../enums/product-status.enum'

export type ProductFilters = {
  name?: string
  price?: number
  currency?: string
  status?: ProductStatus
}

export type Pagination = {
  page: number
  limit: number
}

export const PRODUCT_REPOSITORY = Symbol('PRODUCT_REPOSITORY')

export interface ProductRepository {
  findById(id: string): Promise<ProductPrimitives>

  save(product: ProductPrimitives): Promise<ProductPrimitives>

  update(id: string, product: ProductPrimitives): Promise<ProductPrimitives>

  findAll(filters: ProductFilters, pagination?: Pagination): Promise<ProductPrimitives[]>
}
