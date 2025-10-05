import { Injectable } from '@nestjs/common'
import { Repository } from 'typeorm'
import { ReadableProductSchema } from '../schemas/readable-product.schema'
import { InjectRepository } from '@nestjs/typeorm'
import { ProductId } from '../../../domain/value-object/product-id.vo'
import {
  IProductQueryRepository,
  Pagination,
  PaginationResult,
  ProductFilters,
  ReadProductModel,
} from '../../../domain/repositories/product-query-repository.interface'

@Injectable()
export class ProductQueryRepository implements IProductQueryRepository {
  constructor(
    @InjectRepository(ReadableProductSchema)
    private readonly repo: Repository<ReadableProductSchema>,
  ) {}

  mapToModel(record: ReadableProductSchema): ReadProductModel {
    return {
      id: record.id,
      name: record.name,
      description: record.description,
      price: record.price,
      currency: record.currency,
      isAvailable: record.isAvailable,
      createdAt: new Date(record.createdAt),
      updatedAt: new Date(record.updatedAt),
    }
  }

  async findById(id: ProductId): Promise<ReadProductModel | null> {
    const record = await this.repo.findOneBy({ id: id.toString() })

    if (!record) {
      return null
    }

    return this.mapToModel(record)
  }

  async findAll(
    filters: ProductFilters,
    pagination?: Pagination,
  ): Promise<PaginationResult<ReadProductModel>> {
    const page = pagination?.page ?? 1
    const size = pagination?.limit ?? 20

    const [records, total] = await this.repo.findAndCount({
      where: filters,
      skip: (page - 1) * size,
      take: size,
    })

    return {
      meta: {
        offset: page,
        size: pagination?.limit ?? 20,
        total: total,
      },
      data: records.map((record) => this.mapToModel(record)),
    }
  }
}
