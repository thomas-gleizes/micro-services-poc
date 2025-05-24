import { IQueryHandler, QueryHandler } from '@nestjs/cqrs'
import { PrismaService } from '../../../services/prisma.service'
import { ReadProductQuery } from './read-product.query'

@QueryHandler(ReadProductQuery)
export class ReadProductHandler implements IQueryHandler<ReadProductQuery> {
  constructor(private prisma: PrismaService) {}

  execute(query: ReadProductQuery) {
    return this.prisma.product.findUnique({ where: { id: query.productId } })
  }
}
