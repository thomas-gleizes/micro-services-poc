import { IsNotEmpty, IsNumber, IsPositive, IsString, MaxLength } from 'class-validator'
import { ApiProperty } from '@nestjs/swagger'
import { CreateProductCommand } from '../../../applications/commands/create-product/create-product.command'
import { Transform } from 'class-transformer'

export class CreateProductBodyDto {
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
  @IsPositive()
  price: number

  @ApiProperty({ type: 'string' })
  @IsString()
  @MaxLength(1024)
  @IsNotEmpty()
  currency: string

  toCommand(): CreateProductCommand {
    return new CreateProductCommand(this.name, this.description, this.price, this.currency)
  }
}
