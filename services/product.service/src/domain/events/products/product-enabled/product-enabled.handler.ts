import { EventsHandler, IEventHandler } from '@nestjs/cqrs'
import { ProductEnabledEvent } from './product-enabled.event'
import { Inject } from '@nestjs/common'
import {
  IProductQueryRepository,
  PRODUCT_QUERY_REPOSITORY,
} from '../../../repositories/product-query-repository.interface'

@EventsHandler()
export class ProductEnabledHandler implements IEventHandler<ProductEnabledEvent> {
  constructor(
    @Inject(PRODUCT_QUERY_REPOSITORY)
    private readonly productQueryRepository: IProductQueryRepository,
  ) {}

  async handle(event: ProductEnabledEvent) {
    await this.productQueryRepository.persistFromEvent(event)
  }
}
