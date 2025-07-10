import { ProductPrimitives } from '../../../entities/product.aggregate'
import { BaseEvent } from '../../base.event'

export class ProductUpdatedEvent extends BaseEvent {
  constructor(public readonly product: ProductPrimitives) {
    super();
  }

  /**
   * Deserializes the event data from a JSON string or object.
   * @param data The serialized event data
   */
  static deserialize(data: any): ProductUpdatedEvent {
    return new ProductUpdatedEvent(data.product);
  }

  /**
   * Serializes the event to a JSON-compatible object.
   */
  serialize(): any {
    return {
      product: this.product
    };
  }
}
