import { IProjectionHandler, Projection } from '../../messaging/event/projection.decorator'
import { ProductDisabledEvent } from '../../../domain/events/products/product-disabled.event'
import { EventData } from 'src/infrastructure/events-store/event-store.interface'
import { Repository } from 'typeorm'
import { ReadableProductSchema } from '../schemas/readable-product.schema'
import { InjectRepository } from '@nestjs/typeorm'
import { ConflictUpdateException } from '../../exceptions/conflict-update.exception'

@Projection(ProductDisabledEvent)
export class ProductDisabledProjection implements IProjectionHandler<ProductDisabledProjection> {
  constructor(
    @InjectRepository(ReadableProductSchema)
    private readonly repository: Repository<ReadableProductSchema>,
  ) {}

  async handle(event: EventData<ProductDisabledProjection>): Promise<void> {
    const result = await this.repository.update(
      { id: event.aggregateId, _version: event.version - 1 },
      { isAvailable: false, _version: event.version },
    )

    if (!result.affected) throw new ConflictUpdateException()
  }
}
