import { IEvent } from '@nestjs/cqrs'
import { ProductStatus } from '../../../value-object/product-status.enum'

export class ProductDisabledEvent implements IEvent {
  constructor(
    public readonly productId: string,
    public readonly status: ProductStatus,
  ) {}
}
