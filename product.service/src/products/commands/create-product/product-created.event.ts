import { Product } from '@prisma/client'

export class ProductCreatedEvent {
  static EVENT_NAME = 'product.created'

  constructor(public readonly product: Product) {}
}
