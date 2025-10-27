import { CommandHandler, ICommandHandler } from '@nestjs/cqrs'
import { CreateProductCommand } from './create-product.command'
import { ProductAggregate } from '../../../domain/aggregates/product.aggregate'
import { ProductId } from '../../../domain/value-object/product-id.vo'
import {
  PRODUCT_COMMAND_REPOSITORY,
  IProductCommandRepository,
} from '../../../domain/repositories/product-command-repository.interface'
import { Inject } from '@nestjs/common'
import {
  IDENTIFIANT_GENERATOR,
  IdentifiantGeneratorPort,
} from '../../../domain/ports/identifiant-generator.port'

@CommandHandler(CreateProductCommand)
export class CreateProductHandler
  implements ICommandHandler<CreateProductCommand, ProductAggregate>
{
  constructor(
    @Inject(PRODUCT_COMMAND_REPOSITORY)
    private readonly productCommandRepository: IProductCommandRepository,
    @Inject(IDENTIFIANT_GENERATOR)
    private readonly identifiantGenerator: IdentifiantGeneratorPort,
  ) {}

  async execute(command: CreateProductCommand): Promise<ProductAggregate> {
    const aggregate = ProductAggregate.create(
      new ProductId(this.identifiantGenerator.generateId()),
      command.name,
      command.description,
      command.price,
      command.currency,
    )

    await this.productCommandRepository.save(aggregate)

    return aggregate
  }
}
