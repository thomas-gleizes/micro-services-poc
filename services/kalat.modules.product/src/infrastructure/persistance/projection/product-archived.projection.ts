import { IProjectionHandler, Projection } from '../../messaging/event/projection.decorator'
import { ProductArchivedEvent } from '../../../domain/events/products/product-archived.event'
import { DomainEvent } from 'src/infrastructure/events-store/event-store.interface'
import { Repository } from 'typeorm'
import { ReadableProductSchema } from '../schemas/readable-product.schema'
import { InjectRepository } from '@nestjs/typeorm'
import { ConflictUpdateException } from '../../exceptions/conflict-update.exception'

@Projection(ProductArchivedEvent)
export class ProductArchivedProjection implements IProjectionHandler<ProductArchivedEvent> {
  constructor(
    @InjectRepository(ReadableProductSchema)
    private readonly repository: Repository<ReadableProductSchema>,
  ) {}

  async handle(event: DomainEvent<ProductArchivedEvent>): Promise<void> {
    const result = await this.repository.delete({
      id: event.aggregateId,
      _version: event.version - 1,
    })

    if (!result.affected) throw new ConflictUpdateException()
  }
}
