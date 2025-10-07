import { CommandHandler, ICommandHandler } from '@nestjs/cqrs'
import { EnableProductCommand } from './enable-product.command'
import { ProductAggregate } from '../../../domain/aggregates/product.aggregate'
import { Inject } from '@nestjs/common'
import {
  IProductCommandRepository,
  PRODUCT_COMMAND_REPOSITORY,
} from '../../../domain/repositories/product-command-repository.interface'
import { ProductId } from '../../../domain/value-object/product-id.vo'
import { ProductNotFoundException } from '../../../domain/exceptions/product-not-found.exceptions'

@CommandHandler(EnableProductCommand)
export class EnableProductHandler
  implements ICommandHandler<EnableProductCommand, ProductAggregate>
{
  constructor(
    @Inject(PRODUCT_COMMAND_REPOSITORY)
    private readonly productCommandRepository: IProductCommandRepository,
  ) {}

  async execute(command: EnableProductCommand): Promise<ProductAggregate> {
    const productId = new ProductId(command.productId)
    const aggregate = await this.productCommandRepository.findById(productId)

    if (!aggregate) throw new ProductNotFoundException()

    aggregate.enable()

    await this.productCommandRepository.save(aggregate)

    return aggregate
  }
}
