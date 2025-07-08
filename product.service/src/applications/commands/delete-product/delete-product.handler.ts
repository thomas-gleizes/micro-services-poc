import { ICommandHandler } from '@nestjs/cqrs'
import { DeleteProductCommand } from './delete-product.commend'
import { ProductRepository } from '../../../domain/repositories/product.repository'
import { ProductAggregate } from '../../../domain/entities/product.aggregate'

export class DeleteProductHandler implements ICommandHandler<DeleteProductCommand> {
  constructor(private readonly productRepository: ProductRepository) {}

  async execute(command: DeleteProductCommand): Promise<void> {
    const primitives = await this.productRepository.findById(command.productId)

    const productAggregate = new ProductAggregate(primitives)

    productAggregate.delete()
    productAggregate.commit()
  }
}
