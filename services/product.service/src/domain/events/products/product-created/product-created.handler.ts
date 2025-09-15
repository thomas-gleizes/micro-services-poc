import { ProductCreatedEvent } from './product-created.event'
import { EventsHandler, IEventHandler } from '@nestjs/cqrs'
import { ProductCommandRepository } from '../../../repositories/product-command.repository'
import { Inject } from '@nestjs/common'

@EventsHandler(ProductCreatedEvent)
export class ProductCreatedHandler implements IEventHandler<ProductCreatedEvent> {
  constructor() {}

  async handle(event: ProductCreatedEvent) {
    // await this.productRepository.save(event.product)
  }
}
