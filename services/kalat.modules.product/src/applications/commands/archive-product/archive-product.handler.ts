import { CommandHandler, ICommandHandler } from '@nestjs/cqrs'
import { ArchiveProductCommand } from './archive-product.command'
import { ProductAggregate } from '../../../domain/aggregates/product.aggregate'
import {
  IProductCommandRepository,
  PRODUCT_COMMAND_REPOSITORY,
} from '../../../domain/repositories/product-command-repository.interface'
import { Inject } from '@nestjs/common'
import { ProductId } from '../../../domain/value-object/product-id.vo'
import { ProductNotFoundException } from '../../../domain/exceptions/product-not-found.exceptions'

@CommandHandler(ArchiveProductCommand)
export class ArchiveProductHandler
  implements ICommandHandler<ArchiveProductCommand, ProductAggregate>
{
  constructor(
    @Inject(PRODUCT_COMMAND_REPOSITORY)
    private readonly productCommandRepository: IProductCommandRepository,
  ) {}

  async execute(command: ArchiveProductCommand): Promise<ProductAggregate> {
    const productId = new ProductId(command.productId)
    const aggregate = await this.productCommandRepository.findById(productId)

    if (!aggregate) throw new ProductNotFoundException()

    aggregate.archive()

    await this.productCommandRepository.save(aggregate)

    return aggregate
  }
}
