import { EventsHandler, IEventHandler } from '@nestjs/cqrs'
import { ProductUpdatedEvent } from './product-updated.event'

@EventsHandler(ProductUpdatedEvent)
export class ProductUpdatedHandler implements IEventHandler<ProductUpdatedEvent> {
  constructor() {}

  async handle(event: ProductUpdatedEvent) {
    // await this.productRepository.update(event.product.id, event.product)
  }
}
