import { CreateProductDto } from '../../../presentation/dtos/input/create-product.dto'
import { ICommand } from '@nestjs/cqrs'
import { ProductProps } from '../../../domain/entities/product.entity'
import { Message } from '../../../shared/messaging/message.interface'

export class UpdateProductCommand implements ICommand {
  constructor(
    public readonly productId: string,
    public readonly data: CreateProductDto,
  ) {
    // super()
  }
}

export class UpdateProductCommandReply extends Message {
  constructor(public readonly product: ProductProps) {
    super()
  }
}
