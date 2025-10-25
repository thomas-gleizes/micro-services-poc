import { Injectable } from '@nestjs/common'
import { ProductId } from '../../../domain/value-object/product-id.vo'
import { PrismaService } from '../../../shared/prisma/prisma.service'
import { ReadableProduct } from '@prisma/client'
import {
  IProductQueryRepository,
  Pagination,
  PaginationResult,
  ProductFilters,
  ReadProductModel,
} from '../../../domain/repositories/product-query-repository.interface'

@Injectable()
export class ProductQueryRepository implements IProductQueryRepository {
  constructor(private readonly prisma: PrismaService) {}

  mapToModel(record: ReadableProduct): ReadProductModel {
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
    const record = await this.prisma.readableProduct.findUnique({ where: { id: id.toString() } })

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

    const records = await this.prisma.readableProduct.findMany({
      where: filters,
      skip: (page - 1) * size,
      take: size,
    })

    return {
      meta: {
        offset: page,
        size: pagination?.limit ?? 20,
        total: await this.prisma.readableProduct.count({ where: filters }),
      },
      data: records.map((record) => this.mapToModel(record)),
    }
  }
}
