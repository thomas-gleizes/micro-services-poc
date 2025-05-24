import { CommandHandler, ICommandHandler } from '@nestjs/cqrs'
import { CreateProductCommand } from './create-product.command'
import { PrismaService } from '../../../services/prisma.service'
import { Product } from '@prisma/client'

@CommandHandler(CreateProductCommand)
export class CreateProductHandler implements ICommandHandler<CreateProductCommand> {
  constructor(private readonly prisma: PrismaService) {}

  execute(command: CreateProductCommand): Promise<Product> {
    return this.prisma.product.create({
      data: {
        name: command.name,
        price: command.price,
      },
    })
  }
}
