import { ProductPrimitives } from '../../../entities/product.aggregate'
import { DomainEvent } from '../../domain-event'

type Data = {
  product: ProductPrimitives
}

export class ProductUpdatedEvent extends DomainEvent<Data, any> {
  constructor(public readonly product: ProductPrimitives) {
    super()
  }

  static deserialize(data: Data): ProductUpdatedEvent {
    return new ProductUpdatedEvent(data.product)
  }

  serialize(): Data {
    return {
      product: this.product,
    }
  }
}
