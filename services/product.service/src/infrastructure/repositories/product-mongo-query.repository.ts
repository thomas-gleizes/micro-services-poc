import {
  Pagination,
  PaginationResult,
  ProductFilters,
  ProductQueryRepository,
  ReadProduct,
} from '../../domain/repositories/product-query.repository'
import { Injectable } from '@nestjs/common'

@Injectable()
export class ProductMongoQueryRepository implements ProductQueryRepository {
  findById(id: string): Promise<ReadProduct> {
    throw new Error('Method not implemented.')
  }

  findAll(
    filters: ProductFilters,
    pagination?: Pagination,
  ): Promise<PaginationResult<ReadProduct>> {
    throw new Error('Method not implemented.')
  }
}
