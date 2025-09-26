import { EventsHandler, IEventHandler } from '@nestjs/cqrs'
import { ProductArchivedEvent } from './product-archived.event'
import {
  IProductQueryRepository,
  PRODUCT_QUERY_REPOSITORY,
} from '../../../repositories/product-query-repository.interface'
import { Inject } from '@nestjs/common'

@EventsHandler(ProductArchivedEvent)
export class ProductDeletedHandler implements IEventHandler<ProductArchivedEvent> {
  constructor(
    @Inject(PRODUCT_QUERY_REPOSITORY)
    private readonly productQueryRepository: IProductQueryRepository,
  ) {}

  async handle(event: ProductArchivedEvent) {
    await this.productQueryRepository.persistFromEvent(event)
  }
}
