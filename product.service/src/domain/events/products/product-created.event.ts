import { ProductPrimitives } from '../../entities/product.aggregate'
import { IEvent } from '@nestjs/cqrs'

export class ProductCreatedEvent implements IEvent {
  constructor(public readonly product: ProductPrimitives) {}
}
