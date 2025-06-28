import { Product } from '@prisma/client'

export class ProductUpdateEvent {
  static EVENT_NAME = 'product.updated'

  constructor(
    public readonly id: string,
    public readonly product: Omit<Product, 'id'>,
  ) {}
}
