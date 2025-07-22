import { CreateProductDto } from '../../../presentation/dtos/create-product.dto'
import { ICommand } from '@nestjs/cqrs'
import { ProductProps } from '../../../domain/entities/product.entity'

export class UpdateProductCommand implements ICommand {
  constructor(
    public readonly productId: string,
    public readonly data: CreateProductDto,
  ) {}
}

export class UpdateProductCommandReply {
  constructor(public readonly product: ProductProps) {}
}
