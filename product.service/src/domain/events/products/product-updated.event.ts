import { IEvent } from '@nestjs/cqrs'
import { ProductPrimitives } from '../../entities/product.aggregate'

export class ProductUpdatedEvent implements IEvent {
  constructor(public readonly product: ProductPrimitives) {}
}
