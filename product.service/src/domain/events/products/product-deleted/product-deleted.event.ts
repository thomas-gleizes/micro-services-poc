import { BaseEvent } from '../../base.event'

export class ProductDeletedEvent extends BaseEvent {
  constructor(public readonly productId: string) {
    super();
  }

  /**
   * Deserializes the event data from a JSON string or object.
   * @param data The serialized event data
   */
  static deserialize(data: any): ProductDeletedEvent {
    return new ProductDeletedEvent(data.productId);
  }

  /**
   * Serializes the event to a JSON-compatible object.
   */
  serialize(): any {
    return {
      productId: this.productId
    };
  }
}
