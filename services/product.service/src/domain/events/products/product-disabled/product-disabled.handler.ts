import { EventsHandler, IEventHandler } from '@nestjs/cqrs'
import { ProductDisabledEvent } from './product-disabled.event'
import { Inject } from '@nestjs/common'
import {
  IProductQueryRepository,
  PRODUCT_QUERY_REPOSITORY,
} from '../../../repositories/product-query-repository.interface'

@EventsHandler(ProductDisabledEvent)
export class ProductDisabledHandler implements IEventHandler<ProductDisabledEvent> {
  constructor(
    @Inject(PRODUCT_QUERY_REPOSITORY)
    private readonly productQueryRepository: IProductQueryRepository,
  ) {}

  async handle(event: ProductDisabledEvent) {
    await this.productQueryRepository.persistFromEvent(event)
  }
}
