import { EventsHandler, IEventHandler } from '@nestjs/cqrs'
import { ProductUpdatedEvent } from './product-updated.event'
import { Inject } from '@nestjs/common'
import {
  IProductQueryRepository,
  PRODUCT_QUERY_REPOSITORY,
} from '../../../repositories/product-query-repository.interface'

@EventsHandler(ProductUpdatedEvent)
export class ProductUpdatedHandler implements IEventHandler<ProductUpdatedEvent> {
  constructor(
    @Inject(PRODUCT_QUERY_REPOSITORY)
    private readonly productQueryRepository: IProductQueryRepository,
  ) {}

  async handle(event: ProductUpdatedEvent) {
    await this.productQueryRepository.persistFromEvent(event)
  }
}
