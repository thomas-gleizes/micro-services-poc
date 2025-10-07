import { IProjectionHandler, Projection } from '../../messaging/event/projection.decorator'
import { ProductEnabledEvent } from '../../../domain/events/products/product-enabled.event'
import { DomainEvent } from 'src/infrastructure/events-store/event-store.interface'
import { InjectRepository } from '@nestjs/typeorm'
import { ReadableProductSchema } from '../schemas/readable-product.schema'
import { Repository } from 'typeorm'
import { ConflictUpdateException } from '../../exceptions/conflict-update.exception'

@Projection(ProductEnabledEvent)
export class ProductEnabledProjection implements IProjectionHandler<ProductEnabledEvent> {
  constructor(
    @InjectRepository(ReadableProductSchema)
    private readonly repository: Repository<ReadableProductSchema>,
  ) {}

  async handle(event: DomainEvent<ProductEnabledEvent>): Promise<void> {
    const result = await this.repository.update(
      { id: event.aggregateId, _version: event.version - 1 },
      { isAvailable: true, _version: event.version },
    )

    if (!result.affected) throw new ConflictUpdateException()
  }
}
