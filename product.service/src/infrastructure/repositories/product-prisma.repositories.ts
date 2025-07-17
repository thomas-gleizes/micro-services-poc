import { Injectable } from '@nestjs/common'
import { Product, Prisma } from '@prisma/client'
import { Pagination, ProductFilters, ProductRepository } from '../../domain/repositories/product.repository'
import { ProductPrimitives } from 'src/domain/entities/product.aggregate'
import { ProductStatus } from '../../domain/enums/product-status.enum'
import { ProductNotFoundException } from '../../domain/execptions/product-not-found.expetion'
import { PrismaService } from '../../shared/prisma/prisma.service'

@Injectable()
export class ProductPrismaRepository implements ProductRepository {
  constructor(private readonly prisma: PrismaService) {}

  private mapToPrimitives(record: Product): ProductPrimitives {
    return {
      id: record.id,
      name: record.name,
      price: record.price,
      description: record.description,
      currency: record.currency,
      image: record.image,
      status: record.status as ProductStatus,
      createdAt: record.createdAt,
      updatedAt: record.updatedAt,
    }
  }

  private buildFilters(filters: ProductFilters): Prisma.ProductWhereInput {
    return filters
  }

  async findById(id: string): Promise<ProductPrimitives> {
    const product = await this.prisma.product.findUnique({ where: { id } })

    if (!product) throw new ProductNotFoundException()

    return this.mapToPrimitives(product)
  }

  async save(product: ProductPrimitives): Promise<ProductPrimitives> {
    const record = await this.prisma.product.create({
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
        version_occ: 1,
      },
    })

    return this.mapToPrimitives(record)
  }

  async update(id: string, data: ProductPrimitives): Promise<ProductPrimitives> {
    const record = await this.prisma.product.findFirst({
      where: { id: id },
    })

    if (!record) throw new ProductNotFoundException()

    return this.prisma.product
      .update({
        where: { id, version_occ: record.version_occ },
        data: {
          name: data.name,
          price: data.price,
          description: data.description,
          currency: data.currency,
          image: data.image,
          status: data.status,
          updatedAt: data.updatedAt,
          version_occ: record.version_occ + 1,
        },
      })
      .then((record) => this.mapToPrimitives(record))
      .catch(() => {
        throw new ProductNotFoundException()
      })
  }

  async findAll(filters: ProductFilters, pagination?: Pagination): Promise<ProductPrimitives[]> {
    const limit = pagination?.limit || 10
    const page = pagination?.page || 0

    const records = await this.prisma.product.findMany({
      where: this.buildFilters(filters),
      skip: page * limit,
      take: limit,
    })

    return records.map((record) => this.mapToPrimitives(record))
  }

  async delete(id: string): Promise<void> {
    const record = await this.prisma.product.findFirst({
      where: { id },
    })

    if (!record) throw new ProductNotFoundException()

    try {
      await this.prisma.product.delete({
        where: { id, version_occ: record.version_occ },
      })
    } catch (error) {
      throw new ProductNotFoundException()
    }
  }
}
