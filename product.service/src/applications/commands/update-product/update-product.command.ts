import { CreateProductDto } from '../../../presentation/dtos/create-product.dto'

export class UpdateProductCommand {
  constructor(
    public readonly productId: string,
    public readonly data: CreateProductDto,
  ) {}
}
