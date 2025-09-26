import { ProductCreatedEvent } from './product-created.event'
import { EventsHandler, IEventHandler } from '@nestjs/cqrs'

@EventsHandler(ProductCreatedEvent)
export class ProductCreatedHandler implements IEventHandler<ProductCreatedEvent> {
  constructor() {}

  async handle(event: ProductCreatedEvent) {
    console.log('handle', event)
  }
}
