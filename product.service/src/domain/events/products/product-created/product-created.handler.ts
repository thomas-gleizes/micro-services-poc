import { ProductCreatedEvent } from './product-created.event'
import { EventsHandler, IEventHandler } from '@nestjs/cqrs'
import { PRODUCT_REPOSITORY, ProductRepository } from '../../../repositories/product.repository'
import { Inject } from '@nestjs/common'

@EventsHandler(ProductCreatedEvent)
export class ProductCreatedHandler implements IEventHandler<ProductCreatedEvent> {
  constructor(
    @Inject(PRODUCT_REPOSITORY)
    private readonly productRepository: ProductRepository,
  ) {}

  async handle(event: ProductCreatedEvent) {
    await this.productRepository.save(event.product)
  }
}
