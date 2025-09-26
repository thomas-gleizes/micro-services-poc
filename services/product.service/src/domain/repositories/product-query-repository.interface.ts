import { ProductStatus } from '../value-object/product-status.enum'
import { ProductId } from '../value-object/product-id.vo'
import { productEvents } from '../events'

export type ReadProductModel = {
  id: string
  name: string
  description: string
  price: number
  currency: string
  isAvailable: boolean
  createdAt: Date
  updatedAt: Date
}

export type PaginationResult<T> = {
  data: T[]
  meta: {
    total: number
    size: number
    offset: number
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

export interface IProductQueryRepository {
  findById(id: ProductId): Promise<ReadProductModel | null>

  findAll(
    filters: ProductFilters,
    pagination?: Pagination,
  ): Promise<PaginationResult<ReadProductModel>>

  persistFromEvent(event: InstanceType<(typeof productEvents)[number]>): Promise<void>
}
