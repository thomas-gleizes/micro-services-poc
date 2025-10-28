import { EventsHandler, IEventHandler } from '@nestjs/cqrs'
import { ProductEnabledEvent } from '../../../domain/events/products/product-enabled.event'
import { PrismaService } from '../../../shared/prisma/prisma.service'

@EventsHandler(ProductEnabledEvent)
export class ProductEnabledProjection implements IEventHandler<ProductEnabledEvent> {
  constructor(private readonly prisma: PrismaService) {}

  async handle(event: ProductEnabledEvent): Promise<void> {
    await this.prisma.readableProduct.update({
      where: { id: event.productId },
      data: { isAvailable: true },
    })
  }
}
