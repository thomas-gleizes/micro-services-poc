import { CommandHandler, EventPublisher, ICommandHandler } from '@nestjs/cqrs'
import { UpdateProductCommand } from './update-product.command'
import { ProductRepository } from '../../../domain/repositories/product.repository'
import { ProductAggregate } from '../../../domain/entities/product.aggregate'

@CommandHandler(UpdateProductCommand)
export class UpdateProductHandler implements ICommandHandler<UpdateProductCommand> {
  constructor(
    private readonly productRepository: ProductRepository,
    private readonly publisher: EventPublisher,
  ) {}

  async execute(command: UpdateProductCommand) {
    const primitives = await this.productRepository.findById(command.productId)
    const aggregate = this.publisher.mergeObjectContext(new ProductAggregate(primitives))

    aggregate.price = command.data.price
    aggregate.name = command.data.name
    aggregate.description = command.data.description
    aggregate.image = command.data.image
    aggregate.currency = command.data.currency

    aggregate.update()
    aggregate.commit()

    return aggregate.toPrimitives()
  }
}
