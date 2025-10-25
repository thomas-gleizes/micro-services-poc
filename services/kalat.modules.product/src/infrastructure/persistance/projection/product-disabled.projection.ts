import { IProjectionHandler, Projection } from '../../messaging/event/projection.decorator'
import { ProductDisabledEvent } from '../../../domain/events/products/product-disabled.event'
import { EventData } from 'src/infrastructure/events-store/event-store.interface'
import { PrismaService } from '../../../shared/prisma/prisma.service'

@Projection(ProductDisabledEvent)
export class ProductDisabledProjection implements IProjectionHandler<ProductDisabledProjection> {
  constructor(private readonly prisma: PrismaService) {}

  async handle(event: EventData<ProductDisabledProjection>): Promise<void> {
    await this.prisma.readableProduct.update({
      where: { id: event.aggregateId },
      data: { isAvailable: false, aggregateVersion: event.version },
    })
  }
}
