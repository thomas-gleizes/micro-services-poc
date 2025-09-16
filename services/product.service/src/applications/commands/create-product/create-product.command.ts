import { CreateProductDto } from '../../../presentation/dtos/input/create-product.dto'
import { ProductProps } from '../../../domain/entities/product.entity'
import { Message } from '../../../shared/messaging/message.interface'
import { ICommand } from '@nestjs/cqrs'

export class CreateProductCommand extends Message implements ICommand {
  constructor(public readonly data: CreateProductDto) {
    super()
  }
}

export class CreateProductCommandReply extends Message {
  constructor(public readonly product: ProductProps) {
    super()
  }
}
