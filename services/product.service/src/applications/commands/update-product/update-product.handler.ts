import { CommandHandler, ICommandHandler } from '@nestjs/cqrs'
import { UpdateProductCommand } from './update-product.command'
import { ProductAggregate } from '../../../domain/aggregates/product.aggregate'
import {
  PRODUCT_COMMAND_REPOSITORY,
  IProductCommandRepository,
} from '../../../domain/repositories/product-command-repository.interface'
import { Inject } from '@nestjs/common'
import { ProductId } from '../../../domain/value-object/product-id.vo'
import { ProductNotFoundException } from '../../../domain/exceptions/product-not-found.exceptions'

@CommandHandler(UpdateProductCommand)
export class UpdateProductHandler
  implements ICommandHandler<UpdateProductCommand, ProductAggregate>
{
  constructor(
    @Inject(PRODUCT_COMMAND_REPOSITORY)
    private readonly productCommandRepository: IProductCommandRepository,
  ) {}

  async execute(command: UpdateProductCommand): Promise<ProductAggregate> {
    const productId = new ProductId(command.productId)

    const aggregate = await this.productCommandRepository.findById(productId)

    if (!aggregate) throw new ProductNotFoundException()

    aggregate.update(command.name, command.description, command.price, command.currency)

    await this.productCommandRepository.save(aggregate)
    aggregate.commit()

    return aggregate
  }
}
