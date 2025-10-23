import { IProjectionHandler, Projection } from '../../messaging/event/projection.decorator'
import { ProductCreatedEvent } from '../../../domain/events/products/product-created.event'
import { EventData } from '../../events-store/event-store.interface'
import { Repository } from 'typeorm'
import { InjectRepository } from '@nestjs/typeorm'
import { ReadableProductSchema } from '../schemas/readable-product.schema'

@Projection(ProductCreatedEvent)
export class ProductCreatedProjection implements IProjectionHandler<ProductCreatedEvent> {
  constructor(
    @InjectRepository(ReadableProductSchema)
    private readonly repository: Repository<ReadableProductSchema>,
  ) {}

  async handle(event: EventData<ProductCreatedEvent>) {
    await this.repository.save({
      id: event.aggregateId,
      name: event.payload.name,
      description: event.payload.name,
      price: event.payload.price,
      currency: event.payload.currency,
      isAvailable: event.payload.status === 'AVAILABLE',
      createdAt: event.payload.createdAt,
      updatedAt: event.payload.updatedAt,
      _version: event.version,
    })
  }
}
