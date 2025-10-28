import { EventsHandler, IEventHandler } from '@nestjs/cqrs'
import { ProductDisabledEvent } from '../../../domain/events/products/product-disabled.event'
import { PrismaService } from '../../../shared/prisma/prisma.service'

@EventsHandler(ProductDisabledEvent)
export class ProductDisabledProjection implements IEventHandler<ProductDisabledEvent> {
  constructor(private readonly prisma: PrismaService) {}

  async handle(event: ProductDisabledEvent): Promise<void> {
    await this.prisma.readableProduct.update({
      where: { id: event.productId },
      data: { isAvailable: false },
    })
  }
}
