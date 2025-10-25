import { IProjectionHandler, Projection } from '../../messaging/event/projection.decorator'
import { ProductUpdatedEvent } from '../../../domain/events/products/product-updated.event'
import { EventData } from 'src/infrastructure/events-store/event-store.interface'
import { PrismaService } from '../../../shared/prisma/prisma.service'

@Projection(ProductUpdatedEvent)
export class ProductUpdatedProjection implements IProjectionHandler<ProductUpdatedEvent> {
  constructor(private readonly prisma: PrismaService) {}

  async handle(event: EventData<ProductUpdatedEvent>): Promise<void> {
    await this.prisma.readableProduct.update({
      where: { id: event.aggregateId },
      data: {
        name: event.payload.name,
        description: event.payload.description,
        price: event.payload.price,
        currency: event.payload.currency,
        updatedAt: event.payload.currency,
        aggregateVersion: event.version,
      },
    })
  }
}
