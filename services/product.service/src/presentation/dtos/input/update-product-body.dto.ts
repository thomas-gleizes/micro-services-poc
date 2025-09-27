import { IsNotEmpty, IsNumber, IsPositive, IsString, MaxLength } from 'class-validator'
import { Transform } from 'class-transformer'
import { UpdateProductCommand } from '../../../applications/commands/update-product/update-product.command'
import { ApiProperty } from '@nestjs/swagger'

export class UpdateProductBodyDto {
  @ApiProperty({ type: 'string' })
  @IsString()
  @MaxLength(255)
  @IsNotEmpty()
  name: string

  @ApiProperty({ type: 'string' })
  @IsString()
  @MaxLength(1024)
  @IsNotEmpty()
  description: string

  @ApiProperty({ type: 'string' })
  @IsNumber()
  @Transform(({ value }) => parseInt(value, 10), { toClassOnly: true })
  @IsNotEmpty()
  @IsPositive()
  price: number

  @ApiProperty({ type: 'string' })
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
