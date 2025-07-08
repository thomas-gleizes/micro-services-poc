import { CommandHandler, EventPublisher, ICommandHandler } from '@nestjs/cqrs'
import { CreateProductCommand } from './create-product.command'
import { ProductAggregate, ProductPrimitives } from '../../../domain/entities/product.aggregate'

@CommandHandler(CreateProductCommand)
export class CreateProductHandler implements ICommandHandler<CreateProductCommand> {
  constructor(private readonly publisher: EventPublisher) {}

  async execute(command: CreateProductCommand): Promise<ProductPrimitives> {
    const aggregate = this.publisher.mergeObjectContext(
      ProductAggregate.create({
        name: command.data.name,
        price: command.data.price,
        status: 'AVAILABLE',
        image: command.data.image,
        description: command.data.description,
        currency: command.data.currency,
      }),
    )

    aggregate.commit()

    return aggregate.toPrimitives()
  }
}
