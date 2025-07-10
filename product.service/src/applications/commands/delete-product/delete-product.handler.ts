import { CommandHandler, ICommandHandler } from '@nestjs/cqrs'
import { DeleteProductCommand } from './delete-product.commend'
import { PRODUCT_REPOSITORY, ProductRepository } from '../../../domain/repositories/product.repository'
import { ProductAggregate } from '../../../domain/entities/product.aggregate'
import { Inject } from '@nestjs/common'

@CommandHandler(DeleteProductCommand)
export class DeleteProductHandler implements ICommandHandler<DeleteProductCommand> {
  constructor(
    @Inject(PRODUCT_REPOSITORY)
    private readonly productRepository: ProductRepository,
  ) {}

  async execute(command: DeleteProductCommand): Promise<void> {
    const primitives = await this.productRepository.findById(command.productId)

    const productAggregate = new ProductAggregate(primitives)

    productAggregate.delete()
    productAggregate.commit()
  }
}
