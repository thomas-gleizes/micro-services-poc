import { EventsHandler, IEventHandler } from '@nestjs/cqrs'
import { ProductEnabledEvent } from './product-enabled.event'

@EventsHandler()
export class ProductEnabledHandler implements IEventHandler<ProductEnabledEvent> {
  constructor() {}

  async handle(event: ProductEnabledEvent) {}
}
