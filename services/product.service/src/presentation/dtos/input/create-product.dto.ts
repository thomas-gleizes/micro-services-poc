import { IsNotEmpty, IsNumber, IsPositive, IsString, MaxLength, MinLength } from 'class-validator'
import { Transform } from 'class-transformer'
import { ApiProperty } from '@nestjs/swagger'
import { CreateProductCommand } from '../../../applications/commands/create-product/create-product.command'

export class CreateProductDto {
  @IsString()
  @ApiProperty({ type: 'string' })
  name: string

  @ApiProperty({ type: 'string' })
  @IsString()
  description: string

  @ApiProperty({ type: 'number' })
  @IsNumber()
  @IsPositive()
  price: number

  @ApiProperty({ type: 'string' })
  @IsString()
  currency: string

  toCommand(): CreateProductCommand {
    return new CreateProductCommand(this.name, this.description, this.price, this.currency)
  }
}
