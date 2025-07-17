import { ProductPrimitives } from '../../../entities/product.aggregate'
import { DomainEvent } from '../../domain-event'

type SerializedEvent = {
  product: ProductPrimitives
}

export class ProductCreatedEvent extends DomainEvent<SerializedEvent, ProductCreatedEvent> {
  constructor(public readonly product: ProductPrimitives) {
    super()
  }

  serialize(): SerializedEvent {
    return {
      product: this.product,
    }
  }

  static deserialize(data: SerializedEvent): ProductCreatedEvent {
    return new ProductCreatedEvent(data.product)
  }
}
