import { Injectable } from '@nestjs/common'
import { Repository } from 'typeorm'
import { ReadableProductSchema } from '../schemas/readableProductSchema'
import { InjectRepository } from '@nestjs/typeorm'
import { ProductId } from '../../domain/value-object/product-id.vo'
import {
  IProductQueryRepository,
  Pagination,
  PaginationResult,
  ProductFilters,
  ReadProductModel,
} from '../../domain/repositories/product-query-repository.interface'
import { productEvents } from '../../domain/events'
import { ProductCreatedEvent } from '../../domain/events/products/product-created/product-created.event'
import { ProductStatus } from '../../domain/value-object/product-status.enum'
import { ProductUpdatedEvent } from '../../domain/events/products/product-updated/product-updated.event'
import { ProductDisabledEvent } from '../../domain/events/products/product-disabled/product-disabled.event'
import { ProductEnabledEvent } from '../../domain/events/products/product-enabled/product-enabled.event'
import { ProductArchivedEvent } from '../../domain/events/products/product-archived/product-archived.event'

@Injectable()
export class ProductQueryRepository implements IProductQueryRepository {
  constructor(
    @InjectRepository(ReadableProductSchema)
    private readonly repo: Repository<ReadableProductSchema>,
  ) {}

  async persistFromEvent(event: InstanceType<(typeof productEvents)[number]>): Promise<void> {
    if (event instanceof ProductCreatedEvent) {
      await this.repo.save({
        id: event.productId,
        name: event.name,
        description: event.description,
        price: event.price,
        currency: event.currency,
        isAvailable: event.status === ProductStatus.AVAILABLE,
        createdAt: new Date(event.createdAt),
        updatedAt: new Date(event.updatedAt),
      })
    }

    if (event instanceof ProductUpdatedEvent) {
      await this.repo.update(
        { id: event.productId },
        {
          name: event.name,
          description: event.description,
          price: event.price,
          currency: event.currency,
          updatedAt: new Date(event.updatedAt),
        },
      )
    }

    if (event instanceof ProductDisabledEvent || event instanceof ProductEnabledEvent) {
      await this.repo.update(
        { id: event.productId },
        { isAvailable: event.status === ProductStatus.AVAILABLE },
      )
    }

    if (event instanceof ProductArchivedEvent) {
      await this.repo.delete({ id: event.productId })
    }
  }

  mapToModel(record: ReadableProductSchema): ReadProductModel {
    return {
      id: record.id,
      name: record.name,
      description: record.description,
      price: record.price,
      currency: record.currency,
      isAvailable: record.isAvailable,
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
