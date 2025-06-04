import { IQueryHandler, QueryHandler } from '@nestjs/cqrs'
import { ReadProductsQuery } from './read-products.query'
import { PrismaService } from '../../../services/prisma.service'

@QueryHandler(ReadProductsQuery)
export class ReadProductsHandler implements IQueryHandler<ReadProductsQuery> {
  constructor(private prisma: PrismaService) {}

  execute(query: ReadProductsQuery): Promise<any> {
    return this.prisma.product.findMany({ where: {} })
  }
}
