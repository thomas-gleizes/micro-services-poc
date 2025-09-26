import { ProductCreatedEvent } from './product-created.event'
import { EventsHandler, IEventHandler } from '@nestjs/cqrs'
import { Inject } from '@nestjs/common'
import {
  IProductQueryRepository,
  PRODUCT_QUERY_REPOSITORY,
} from '../../../repositories/product-query-repository.interface'

@EventsHandler(ProductCreatedEvent)
export class ProductCreatedHandler implements IEventHandler<ProductCreatedEvent> {
  constructor(
    @Inject(PRODUCT_QUERY_REPOSITORY)
    private readonly productQueryRepository: IProductQueryRepository,
  ) {}

  async handle(event: ProductCreatedEvent) {
    await this.productQueryRepository.persistFromEvent(event)
  }
}
