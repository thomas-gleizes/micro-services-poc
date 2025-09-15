import { ProductAggregate } from 'src/domain/aggregates/product.aggregate'
import { ProductProps } from 'src/domain/entities/product.entity'
import { ProductCommandRepository } from '../../domain/repositories/product-command.repository'
import { Injectable } from '@nestjs/common'
import { InjectRepository } from '@nestjs/typeorm'
import { ProductSchema } from '../schemas/product.schema'
import { Repository } from 'typeorm'

@Injectable()
export class ProductMongoCommandRepository implements ProductCommandRepository {
  constructor(
    @InjectRepository(ProductSchema)
    private readonly productRepo: Repository<ProductSchema>,
  ) {}

  findById(id: string): Promise<ProductAggregate | null> {
    const record = this.productRepo.findBy({ id: id })

    throw new Error('Method not implemented.')
  }

  save(product: ProductProps): Promise<ProductAggregate | null> {
    throw new Error('Method not implemented.')
  }

  update(id: string, product: ProductProps): Promise<ProductAggregate | null> {
    throw new Error('Method not implemented.')
  }

  delete(id: string): Promise<void> {
    throw new Error('Method not implemented.')
  }
}
