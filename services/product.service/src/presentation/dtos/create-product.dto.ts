import { IsNotEmpty, IsNumber, IsString, MaxLength, MinLength } from 'class-validator'
import { Transform } from 'class-transformer'

export class CreateProductDto {
  @IsString()
  name: string

  @IsNumber()
  price: number

  @IsString()
  description: string

  @IsString()
  currency: string

  @IsString()
  image: string
}
