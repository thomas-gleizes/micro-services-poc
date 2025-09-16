import { AggregateRoot } from '@nestjs/cqrs'
import { ProductCreatedEvent } from '../events/products/product-created/product-created.event'
import { ProductUpdatedEvent } from '../events/products/product-updated/product-updated.event'
import { ProductDeletedEvent } from '../events/products/product-deleted/product-deleted.event'
import { Product } from '../entities/product.entity'
import { ProductState } from '../value-object/product-state.vo'

export class ProductAggregate extends AggregateRoot {
  private readonly state: ProductState
  public readonly product: Product
  constructor(product: Product, state: ProductState) {
    super()

    this.product = product
    this.state = state
  }

  static create(product: Product) {
    const aggregate = new ProductAggregate(product, ProductState.createCreated())

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
