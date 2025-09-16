import { CommandHandler, ICommandHandler } from '@nestjs/cqrs'
import { UpdateProductCommand } from './update-product.command'
import { ProductProps } from '../../../domain/entities/product.entity'
import {
  PRODUCT_COMMAND_REPOSITORY,
  ProductCommandRepository,
} from '../../../domain/repositories/product-command.repository'
import { Inject } from '@nestjs/common'
import { ProductId } from '../../../domain/value-object/product-id.vo'
import { ProductNotFoundException } from '../../../domain/exceptions/product-not-found.exceptions'

@CommandHandler(UpdateProductCommand)
export class UpdateProductHandler implements ICommandHandler<UpdateProductCommand> {
  constructor(
    @Inject(PRODUCT_COMMAND_REPOSITORY)
    private readonly productRepository: ProductCommandRepository,
  ) {}

  async execute(command: UpdateProductCommand): Promise<ProductProps> {
    const productId = new ProductId(command.productId)

    const aggregate = await this.productRepository.findById(productId)

    if (!aggregate) throw new ProductNotFoundException()

    aggregate.product.price = command.data.price
    aggregate.product.name = command.data.name
    aggregate.product.description = command.data.description
    aggregate.product.image = command.data.image
    aggregate.product.currency = command.data.currency

    aggregate.update()
    aggregate.commit()

    return aggregate.product.toPrimitives()
  }
}
