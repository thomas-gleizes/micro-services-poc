import { CreateProductDto } from '../../../presentation/dtos/create-product.dto'
import { ProductProps } from '../../../domain/entities/product.entity'

export class CreateProductCommand {
  constructor(public readonly data: CreateProductDto) {}
}

export class CreateProductCommandReply {
  constructor(public readonly product: ProductProps) {}
}
