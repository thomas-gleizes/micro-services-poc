import { ProductAggregate } from 'src/domain/aggregates/product.aggregate'
import { ProductProps } from 'src/domain/entities/product.entity'
import { ProductCommandRepository } from '../../domain/repositories/product-command.repository'
import { Injectable } from '@nestjs/common'
import { InjectRepository } from '@nestjs/typeorm'
import { ProductSchema } from '../schemas/product.schema'
import { Repository } from 'typeorm'
import { ProductId } from '../../domain/value-object/product-id.vo'

@Injectable()
export class ProductMongoCommandRepository implements ProductCommandRepository {
  constructor(
    @InjectRepository(ProductSchema)
    private readonly productRepo: Repository<ProductSchema>,
  ) {}

  findById(id: ProductId): Promise<ProductAggregate | null> {
    console.log(id)
    return Promise.resolve(null)
  }

  save(product: ProductProps): Promise<ProductAggregate | null> {
    console.log(product)
    return Promise.resolve(null)
  }

  update(id: ProductId, product: ProductProps): Promise<ProductAggregate | null> {
    console.log(id, product)

    return Promise.resolve(null)
  }

  delete(id: ProductId): Promise<void> {
    console.log(id)
    return Promise.resolve()
  }
}
