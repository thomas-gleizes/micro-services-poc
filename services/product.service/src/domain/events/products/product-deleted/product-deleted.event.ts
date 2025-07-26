import { DomainEvent } from '../../domain-event'

export class ProductDeletedEvent extends DomainEvent<string, ProductDeletedEvent> {
  constructor(public readonly productId: string) {
    super()
  }

  serialize(): string {
    return this.productId
  }

  static deserialize(data: string) {
    return new ProductDeletedEvent(data)
  }
}
