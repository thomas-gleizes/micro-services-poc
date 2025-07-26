import { DomainEvent } from '../../domain-event'
import { ProductProps } from '../../../entities/product.entity'

type SerializedEvent = {
  product: ProductProps
}

export class ProductCreatedEvent extends DomainEvent<SerializedEvent, ProductCreatedEvent> {
  constructor(public readonly product: ProductProps) {
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
