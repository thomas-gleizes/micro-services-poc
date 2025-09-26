import { CommandHandler, EventPublisher, ICommandHandler } from '@nestjs/cqrs'
import { CreateProductCommand } from './create-product.command'
import { ProductAggregate } from '../../../domain/aggregates/product.aggregate'
import { ProductId } from '../../../domain/value-object/product-id.vo'
import { randomUUID } from 'node:crypto'
import {
  PRODUCT_COMMAND_REPOSITORY,
  IProductCommandRepository,
} from '../../../domain/repositories/product-command-repository.interface'
import { Inject } from '@nestjs/common'

@CommandHandler(CreateProductCommand)
export class CreateProductHandler
  implements ICommandHandler<CreateProductCommand, ProductAggregate>
{
  constructor(
    private readonly publisher: EventPublisher,
    @Inject(PRODUCT_COMMAND_REPOSITORY)
    private readonly productCommandRepository: IProductCommandRepository,
  ) {}

  async execute(command: CreateProductCommand): Promise<ProductAggregate> {
    const aggregate = this.publisher.mergeObjectContext(
      ProductAggregate.create(
        new ProductId(randomUUID()),
        command.name,
        command.description,
        command.price,
        command.currency,
      ),
    )

    await this.productCommandRepository.save(aggregate)
    aggregate.commit()

    return aggregate
  }
}
