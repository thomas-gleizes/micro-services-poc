import { EventsHandler, IEventHandler } from '@nestjs/cqrs'
import { ProductUpdatedEvent } from '../../../domain/events/products/product-updated.event'
import { PrismaService } from '../../../shared/prisma/prisma.service'

@EventsHandler(ProductUpdatedEvent)
export class ProductUpdatedProjection implements IEventHandler<ProductUpdatedEvent> {
  constructor(private readonly prisma: PrismaService) {}

  async handle(event: ProductUpdatedEvent): Promise<void> {
    await this.prisma.readableProduct.update({
      where: { id: event.productId },
      data: {
        name: event.name,
        description: event.description,
        price: event.price,
        currency: event.currency,
        updatedAt: event.currency,
      },
    })
  }
}
