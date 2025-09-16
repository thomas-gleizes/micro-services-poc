import {
  Pagination,
  PaginationResult,
  ProductFilters,
  ProductQueryRepository,
  ReadProductModel,
} from '../../domain/repositories/product-query.repository'
import { Injectable } from '@nestjs/common'
import { Repository } from 'typeorm'
import { ProductSchema } from '../schemas/product.schema'
import { InjectRepository } from '@nestjs/typeorm'
import { ProductId } from '../../domain/value-object/product-id.vo'
import { ProductStatus } from '../../domain/value-object/product-status.enum'

@Injectable()
export class ProductMongoQueryRepository implements ProductQueryRepository {
  constructor(
    @InjectRepository(ProductSchema)
    private readonly repo: Repository<ProductSchema>,
  ) {}

  mapToModel(record: ProductSchema): ReadProductModel {
    return {
      id: record.id,
      name: record.name,
      description: record.description,
      price: record.price,
      currency: record.currency,
      image: record.image,
      status: record.status as ProductStatus,
      createdAt: record.createdAt,
      updatedAt: record.updatedAt,
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
