import { ProductPrimitives } from '../../../entities/product.aggregate'
import { BaseEvent } from '../../base.event'

export class ProductCreatedEvent extends BaseEvent {
  constructor(public readonly product: ProductPrimitives) {
    super()
  }

  /**
   * Deserializes the event data from a JSON string or object.
   * @param data The serialized event data
   */
  static deserialize(data: any): ProductCreatedEvent {
    return new ProductCreatedEvent(data.product)
  }

  /**
   * Serializes the event to a JSON-compatible object.
   */
  serialize(): any {
    return {
      product: this.product,
    }
  }
}
