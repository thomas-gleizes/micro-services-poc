import { CommandHandler, ICommandHandler } from '@nestjs/cqrs'
import { DisableProductCommand } from './disable-product.command'
import { ProductAggregate } from '../../../domain/aggregates/product.aggregate'
import { Inject } from '@nestjs/common'
import {
  IProductCommandRepository,
  PRODUCT_COMMAND_REPOSITORY,
} from '../../../domain/repositories/product-command-repository.interface'
import { ProductId } from '../../../domain/value-object/product-id.vo'
import { ProductNotFoundException } from '../../../domain/exceptions/product-not-found.exceptions'

@CommandHandler(DisableProductCommand)
export class DisableProductHandler
  implements ICommandHandler<DisableProductCommand, ProductAggregate>
{
  constructor(
    @Inject(PRODUCT_COMMAND_REPOSITORY)
    private readonly productCommandRepository: IProductCommandRepository,
  ) {}

  async execute(command: DisableProductCommand): Promise<ProductAggregate> {
    const productId = new ProductId(command.productId)
    const aggregate = await this.productCommandRepository.findById(productId)

    if (!aggregate) throw new ProductNotFoundException()

    aggregate.disable()

    await this.productCommandRepository.save(aggregate)
    aggregate.commit()

    return aggregate
  }
}
