import { CommandHandler, EventPublisher, ICommandHandler } from '@nestjs/cqrs'
import { DeleteProductCommand } from './delete-product.commend'

@CommandHandler(DeleteProductCommand)
export class DeleteProductHandler implements ICommandHandler<DeleteProductCommand> {
  constructor(private readonly publisher: EventPublisher) {}

  async execute(command: DeleteProductCommand): Promise<void> {
    // const primitives = await this.productRepository.findById(command.productId)
    // const productAggregate = this.publisher.mergeObjectContext(new ProductAggregate(primitives))
    //
    // productAggregate.delete()
    // productAggregate.commit()
  }
}
