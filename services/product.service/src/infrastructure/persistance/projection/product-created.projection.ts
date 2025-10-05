import { IProjectionHandler, Projection } from '../../messaging/event/projection.decorator'
import { ProductCreatedEvent } from '../../../domain/events/products/product-created.event'
import { DomainEvent } from '../../events-store/event-store.interface'
import { Repository } from 'typeorm'
import { InjectRepository } from '@nestjs/typeorm'
import { ReadableProductSchema } from '../schemas/readable-product.schema'

@Projection(ProductCreatedEvent)
export class ProductCreatedProjection implements IProjectionHandler<ProductCreatedEvent> {
  constructor(
    @InjectRepository(ReadableProductSchema)
    private readonly repository: Repository<ReadableProductSchema>,
  ) {}

  async handle(event: DomainEvent<ProductCreatedEvent>) {
    await this.repository.save({
      id: event.aggregateId,
      name: event.data.name,
      description: event.data.name,
      price: event.data.price,
      currency: event.data.currency,
      isAvailable: event.data.status === 'AVAILABLE',
      createdAt: event.data.createdAt,
      updatedAt: event.data.updatedAt,
      _version: event.version,
    })
  }
}
