import { EventsHandler, IEventHandler } from '@nestjs/cqrs'
import { Inject } from '@nestjs/common'
import { ProductUpdatedEvent } from './product-updated.event'
import { PRODUCT_REPOSITORY, ProductRepository } from '../../../repositories/product.repository'

@EventsHandler(ProductUpdatedEvent)
export class ProductUpdatedHandler implements IEventHandler<ProductUpdatedEvent> {
  constructor(
    @Inject(PRODUCT_REPOSITORY)
    private readonly productRepository: ProductRepository,
  ) {}

  async handle(event: ProductUpdatedEvent) {
    await this.productRepository.update(event.product.id, event.product)
  }
}
