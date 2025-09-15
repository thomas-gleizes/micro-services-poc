import { ProductStatus } from '../value-object/product-status.enum'

export type ReadProduct = {
  id: string
  name: string
  description: string
  price: number
  currency: string
  image: string
  status: ProductStatus
  createdAt: Date
  updatedAt: Date
}

export type PaginationResult<T> = {
  data: T[]
  meta: {
    total: number
    limit: number
    page: number
  }
}

export type ProductFilters = {
  name?: string
  price?: number
  currency?: string
  status?: ProductStatus
}

export type Pagination = {
  page?: number
  limit?: number
}

export const PRODUCT_QUERY_REPOSITORY = Symbol('PRODUCT_QUERY_REPOSITORY')

export interface ProductQueryRepository {
  findById(id: string): Promise<ReadProduct>

  findAll(filters: ProductFilters, pagination?: Pagination): Promise<PaginationResult<ReadProduct>>
}
