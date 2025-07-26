import { DomainEvent } from '../../domain-event'
import { ProductProps } from '../../../entities/product.entity'

type Data = {
  product: ProductProps
}

export class ProductUpdatedEvent extends DomainEvent<Data, any> {
  constructor(public readonly product: ProductProps) {
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
