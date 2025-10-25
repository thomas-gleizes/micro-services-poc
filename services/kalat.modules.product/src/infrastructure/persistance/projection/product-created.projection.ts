import { IProjectionHandler, Projection } from '../../messaging/event/projection.decorator'
import { ProductCreatedEvent } from '../../../domain/events/products/product-created.event'
import { EventData } from '../../events-store/event-store.interface'
import { PrismaService } from '../../../shared/prisma/prisma.service'

@Projection(ProductCreatedEvent)
export class ProductCreatedProjection implements IProjectionHandler<ProductCreatedEvent> {
  constructor(private readonly prisma: PrismaService) {}

  async handle(event: EventData<ProductCreatedEvent>) {
    await this.prisma.readableProduct.create({
      data: {
        id: event.aggregateId,
        name: event.payload.name,
        description: event.payload.name,
        price: event.payload.price,
        currency: event.payload.currency,
        isAvailable: event.payload.status === 'AVAILABLE',
        createdAt: event.payload.createdAt,
        updatedAt: event.payload.updatedAt,
        aggregateVersion: event.version,
      },
    })
  }
}
