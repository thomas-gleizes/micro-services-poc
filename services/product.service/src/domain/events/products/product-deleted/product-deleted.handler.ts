import { EventsHandler, IEventHandler } from '@nestjs/cqrs'
import { ProductDeletedEvent } from './product-deleted.event'

@EventsHandler(ProductDeletedEvent)
export class ProductDeletedHandler implements IEventHandler<ProductDeletedEvent> {
  constructor() {}

  async handle(event: ProductDeletedEvent) {
    // await this.productRepository.delete(event.productId)
  }
}
