import { ProductArchivedEvent } from '../../../domain/events/products/product-archived.event'
import { EventData } from 'src/infrastructure/events-store/event-store.interface'
import { PrismaService } from '../../../shared/prisma/prisma.service'
import { Prisma } from '@prisma/client'
import { RecordNotFoundException } from '../../exceptions/record-not-found.exception'
import { IProjectionHandler, Projection } from '../../messaging/event/projection.decorator'

@Projection(ProductArchivedEvent)
export class ProductArchivedProjection implements IProjectionHandler<ProductArchivedEvent> {
  constructor(private readonly prisma: PrismaService) {}

  async handle(event: EventData<ProductArchivedEvent>): Promise<void> {
    try {
      await this.prisma.readableProduct.delete({ where: { id: event.aggregateId } })
    } catch (error) {
      if (error instanceof Prisma.PrismaClientKnownRequestError) {
        if (error.code === '2022') {
          throw new RecordNotFoundException()
        }
      }
    }
  }
}
