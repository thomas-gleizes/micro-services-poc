import { IProjectionHandler, Projection } from '../../messaging/event/projection.decorator'
import { ProductEnabledEvent } from '../../../domain/events/products/product-enabled.event'
import { EventData } from 'src/infrastructure/events-store/event-store.interface'
import { PrismaService } from '../../../shared/prisma/prisma.service'

@Projection(ProductEnabledEvent)
export class ProductEnabledProjection implements IProjectionHandler<ProductEnabledEvent> {
  constructor(private readonly prisma: PrismaService) {}

  async handle(event: EventData<ProductEnabledEvent>): Promise<void> {
    await this.prisma.readableProduct.update({
      where: { id: event.aggregateId },
      data: { isAvailable: true, aggregateVersion: event.version },
    })
  }
}
