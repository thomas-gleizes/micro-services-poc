import { CommandHandler, EventPublisher, ICommandHandler } from '@nestjs/cqrs'
import { UpdateProductCommand } from './update-product.command'

@CommandHandler(UpdateProductCommand)
export class UpdateProductHandler implements ICommandHandler<UpdateProductCommand> {
  constructor() {}

  async execute(command: UpdateProductCommand) {
    // const product = await this.productRepository.findById(command.productId)
    // const aggregate = this.publisher.mergeObjectContext(new ProductAggregate(product))
    //
    // product.price = command.data.price
    // product.name = command.data.name
    // product.description = command.data.description
    // product.image = command.data.image
    // product.currency = command.data.currency
    //
    // aggregate.update()
    // aggregate.commit()
    //
    // return product.toPrimitives()
  }
}
