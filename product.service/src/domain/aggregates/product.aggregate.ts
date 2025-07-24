import { AggregateRoot } from '@nestjs/cqrs'
import { ProductCreatedEvent } from '../events/products/product-created/product-created.event'
import { ProductUpdatedEvent } from '../events/products/product-updated/product-updated.event'
import { ProductDeletedEvent } from '../events/products/product-deleted/product-deleted.event'
import { Product } from '../entities/product.entity'

export class ProductAggregate extends AggregateRoot {
  constructor(public readonly product: Product) {
    super()
  }

  static create(product: Product) {
    const aggregate = new ProductAggregate(product)

    aggregate.apply(new ProductCreatedEvent(product))

    return aggregate
  }

  update() {
    this.apply(new ProductUpdatedEvent(this.product))
  }

  delete() {
    this.apply(new ProductDeletedEvent(this.product.id))
  }
}
