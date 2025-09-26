import { EventsHandler, IEventHandler } from '@nestjs/cqrs'
import { ProductArchivedEvent } from './product-archived.event'

@EventsHandler(ProductArchivedEvent)
export class ProductDeletedHandler implements IEventHandler<ProductArchivedEvent> {
  constructor() {}

  async handle(event: ProductArchivedEvent) {
    // await this.productRepository.delete(event.productId)
  }
}
