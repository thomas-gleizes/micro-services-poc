import { EventsHandler, IEventHandler } from '@nestjs/cqrs'
import { ProductDisabledEvent } from './product-disabled.event'

@EventsHandler(ProductDisabledEvent)
export class ProductDisabledHandler implements IEventHandler<ProductDisabledEvent> {
  constructor() {}

  async handle(event: ProductDisabledEvent) {}
}
