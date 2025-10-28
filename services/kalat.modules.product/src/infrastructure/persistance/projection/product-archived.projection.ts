import { EventsHandler, IEventHandler } from '@nestjs/cqrs'
import { Prisma } from '@prisma/client'
import { ProductArchivedEvent } from '../../../domain/events/products/product-archived.event'
import { RecordNotFoundException } from '../../exceptions/record-not-found.exception'
import { PrismaService } from '../../../shared/prisma/prisma.service'

@EventsHandler(ProductArchivedEvent)
export class ProductArchivedProjection implements IEventHandler<ProductArchivedEvent> {
  constructor(private readonly prisma: PrismaService) {}

  async handle(event: ProductArchivedEvent): Promise<void> {
    try {
      await this.prisma.readableProduct.delete({ where: { id: event.productId } })
    } catch (error) {
      if (error instanceof Prisma.PrismaClientKnownRequestError) {
        if (error.code === '2022') {
          throw new RecordNotFoundException()
        }
      }
    }
  }
}
