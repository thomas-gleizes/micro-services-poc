import { IProjectionHandler, Projection } from '../../messaging/event/projection.decorator'
import { ProductUpdatedEvent } from '../../../domain/events/products/product-updated.event'
import { DomainEvent } from 'src/infrastructure/events-store/event-store.interface'
import { Repository } from 'typeorm'
import { ReadableProductSchema } from '../schemas/readable-product.schema'
import { InjectRepository } from '@nestjs/typeorm'
import { ConflictUpdateException } from '../../exceptions/conflict-update.exception'

@Projection(ProductUpdatedEvent)
export class ProductUpdatedProjection implements IProjectionHandler<ProductUpdatedEvent> {
  constructor(
    @InjectRepository(ReadableProductSchema)
    private readonly repository: Repository<ReadableProductSchema>,
  ) {}

  async handle(event: DomainEvent<ProductUpdatedEvent>): Promise<void> {
    const result = await this.repository.update(
      {
        id: event.aggregateId,
        _version: event.version - 1,
      },
      {
        name: event.data.name,
        description: event.data.description,
        price: event.data.price,
        currency: event.data.currency,
        updatedAt: event.data.currency,
        _version: event.version,
      },
    )

    if (!result.affected) throw new ConflictUpdateException()
  }
}
