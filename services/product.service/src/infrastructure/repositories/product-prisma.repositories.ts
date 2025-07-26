import { Injectable } from '@nestjs/common'
import { Prisma, ProductSchema } from '@prisma/client'
import { Pagination, ProductFilters, ProductRepository } from '../../domain/repositories/product.repository'
import { ProductStatus } from '../../domain/enums/product-status.enum'
import { PrismaService } from '../../shared/prisma/prisma.service'
import { Product, ProductProps } from '../../domain/entities/product.entity'
import { ProductNotFoundException } from '../../domain/exceptions/product-not-found.exceptions'
import { ConflictUpdateException } from '../exceptions/conflict-update.exception'

@Injectable()
export class ProductPrismaRepository implements ProductRepository {
  constructor(private readonly prisma: PrismaService) {}

  private mapToEntity(record: ProductSchema): Product {
    return new Product({
      id: record.id,
      name: record.name,
      price: record.price,
      description: record.description,
      currency: record.currency,
      image: record.image,
      status: record.status as ProductStatus,
      createdAt: record.createdAt,
      updatedAt: record.updatedAt,
    })
  }

  private buildFilters(filters: ProductFilters): Prisma.ProductSchemaWhereInput {
    return filters
  }

  async findById(id: string): Promise<Product> {
    const product = await this.prisma.productSchema.findUnique({ where: { id } })

    if (!product) throw new ProductNotFoundException()

    return this.mapToEntity(product)
  }

  async save(product: Product): Promise<Product> {
    const record = await this.prisma.productSchema.create({
      data: {
        id: product.id,
        name: product.name,
        price: product.price,
        description: product.description,
        currency: product.currency,
        image: product.image,
        status: product.status,
        createdAt: product.createdAt,
        updatedAt: product.updatedAt,
        occVersion: 1,
      },
    })

    return this.mapToEntity(record)
  }

  async update(id: string, data: ProductProps): Promise<Product> {
    const record = await this.prisma.productSchema.findFirst({
      where: { id: id },
    })

    if (!record) throw new ProductNotFoundException()

    const updateRecord = await this.prisma.productSchema.update({
      where: { id, occVersion: record.occVersion },
      data: {
        name: data.name,
        price: data.price,
        description: data.description,
        currency: data.currency,
        image: data.image,
        status: data.status,
        updatedAt: data.updatedAt,
        occVersion: {
          increment: 1,
        },
      },
    })

    if (!updateRecord) throw new ConflictUpdateException()

    return this.mapToEntity(updateRecord)
  }

  async findAll(filters: ProductFilters, pagination?: Pagination): Promise<Product[]> {
    const limit = pagination?.limit || 10
    const page = pagination?.page || 0

    const records = await this.prisma.productSchema.findMany({
      where: this.buildFilters(filters),
      skip: page * limit,
      take: limit,
    })

    return records.map((record) => this.mapToEntity(record))
  }

  async delete(id: string): Promise<void> {
    const record = await this.prisma.productSchema.findFirst({
      where: { id },
    })

    if (!record) throw new ProductNotFoundException()

    const result = await this.prisma.productSchema.delete({
      where: { id, occVersion: record.occVersion },
    })

    if (result) throw new ConflictUpdateException()
  }
}
