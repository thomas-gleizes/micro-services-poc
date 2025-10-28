import { EventsHandler, IEventHandler } from '@nestjs/cqrs'
import { ProductCreatedEvent } from '../../../domain/events/products/product-created.event'
import { PrismaService } from '../../../shared/prisma/prisma.service'

@EventsHandler(ProductCreatedEvent)
export class ProductCreatedProjection implements IEventHandler<ProductCreatedEvent> {
  constructor(private readonly prisma: PrismaService) {}

  async handle(event: ProductCreatedEvent) {
    await this.prisma.readableProduct.create({
      data: {
        id: event.productId,
        name: event.name,
        description: event.name,
        price: event.price,
        currency: event.currency,
        isAvailable: event.status === 'AVAILABLE',
        createdAt: event.createdAt,
        updatedAt: event.updatedAt,
      },
    })
  }
}
