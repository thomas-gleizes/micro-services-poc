import { CommandHandler, EventPublisher, ICommandHandler } from '@nestjs/cqrs'
import { UpdateProductCommand } from './update-product.command'
import { PRODUCT_REPOSITORY, ProductRepository } from '../../../domain/repositories/product.repository'
import { ProductAggregate } from '../../../domain/aggregates/product.aggregate'
import { Inject } from '@nestjs/common'

@CommandHandler(UpdateProductCommand)
export class UpdateProductHandler implements ICommandHandler<UpdateProductCommand> {
  constructor(
    @Inject(PRODUCT_REPOSITORY)
    private readonly productRepository: ProductRepository,
    private readonly publisher: EventPublisher,
  ) {}

  async execute(command: UpdateProductCommand) {
    const product = await this.productRepository.findById(command.productId)
    const aggregate = this.publisher.mergeObjectContext(new ProductAggregate(product))

    product.price = command.data.price
    product.name = command.data.name
    product.description = command.data.description
    product.image = command.data.image
    product.currency = command.data.currency

    aggregate.update()
    aggregate.commit()

    return product.toPrimitives()
  }
}
