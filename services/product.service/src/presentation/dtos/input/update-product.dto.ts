import { IsNotEmpty, IsNumber, IsString, MaxLength } from 'class-validator'
import { Transform } from 'class-transformer'
import { UpdateProductCommand } from '../../../applications/commands/update-product/update-product.command'

export class UpdateProductDto {
  @IsString()
  @MaxLength(255)
  @IsNotEmpty()
  name: string

  @IsString()
  @MaxLength(1024)
  @IsNotEmpty()
  description: string

  @IsNumber()
  @Transform(({ value }) => parseInt(value, 10), { toClassOnly: true })
  @IsNotEmpty()
  price: number

  @IsString()
  @MaxLength(1024)
  @IsNotEmpty()
  currency: string

  toCommand(productId: string): UpdateProductCommand {
    return new UpdateProductCommand(
      productId,
      this.name,
      this.description,
      this.price,
      this.currency,
    )
  }
}
