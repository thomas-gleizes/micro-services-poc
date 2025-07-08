import { CreateProductDto } from '../../../presentation/dtos/create-product.dto'

export class CreateProductCommand {
  constructor(public data: CreateProductDto) {}
}
