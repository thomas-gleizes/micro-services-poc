import { IProjectionHandler, Projection } from '../../messaging/event/projection.decorator'
import { ProductUpdatedEvent } from '../../../domain/events/products/product-updated.event'
import { EventData } from 'src/infrastructure/events-store/event-store.interface'
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

  async handle(event: EventData<ProductUpdatedEvent>): Promise<void> {
    const result = await this.repository.update(
      {
        id: event.aggregateId,
        _version: event.version - 1,
      },
      {
        name: event.payload.name,
        description: event.payload.description,
        price: event.payload.price,
        currency: event.payload.currency,
        updatedAt: event.payload.currency,
        _version: event.version,
      },
    )

    if (!result.affected) throw new ConflictUpdateException()
  }
}
