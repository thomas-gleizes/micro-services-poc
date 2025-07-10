import { EventsHandler, IEventHandler } from '@nestjs/cqrs'
import { PRODUCT_REPOSITORY, ProductRepository } from '../../../repositories/product.repository'
import { ProductDeletedEvent } from './product-deleted.event'
import { Inject } from '@nestjs/common'

@EventsHandler(ProductDeletedEvent)
export class ProductDeletedHandler implements IEventHandler<ProductDeletedEvent> {
  constructor(
    @Inject(PRODUCT_REPOSITORY)
    private readonly productRepository: ProductRepository,
  ) {}

  async handle(event: ProductDeletedEvent) {
    await this.productRepository.delete(event.productId)
  }
}
