import { ProductStatus } from '../enums/product-status.enum'
import { Product, ProductProps } from '../entities/product.entity'

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
  findById(id: string): Promise<Product>

  save(product: ProductProps): Promise<Product>

  update(id: string, product: ProductProps): Promise<Product>

  findAll(filters: ProductFilters, pagination?: Pagination): Promise<Product[]>

  delete(id: string): Promise<void>
}
