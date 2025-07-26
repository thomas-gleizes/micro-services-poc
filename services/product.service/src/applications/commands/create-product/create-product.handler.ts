import { CommandHandler, EventPublisher, ICommandHandler } from '@nestjs/cqrs'
import { CreateProductCommand } from './create-product.command'
import { ProductAggregate } from '../../../domain/aggregates/product.aggregate'
import { Product, ProductProps } from '../../../domain/entities/product.entity'
import { ProductStatus } from '../../../domain/enums/product-status.enum'

@CommandHandler(CreateProductCommand)
export class CreateProductHandler implements ICommandHandler<CreateProductCommand> {
  constructor(private readonly publisher: EventPublisher) {}

  async execute(command: CreateProductCommand): Promise<ProductProps> {
    const aggregate = this.publisher.mergeObjectContext(
      ProductAggregate.create(
        Product.create({
          name: command.data.name,
          price: command.data.price,
          status: ProductStatus.UNAVAILABLE,
          image: command.data.image,
          description: command.data.description,
          currency: command.data.currency,
        }),
      ),
    )

    aggregate.commit()

    return aggregate.product.toPrimitives()
  }
}
