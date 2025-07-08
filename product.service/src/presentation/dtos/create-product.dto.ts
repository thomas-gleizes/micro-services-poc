import { IsNotEmpty, IsNumber, IsString, MaxLength, MinLength } from 'class-validator'
import { Transform } from 'class-transformer'

export class CreateProductDto {
  @IsString()
  name: string

  @IsNumber()
  @Transform(({ value }) => +value, { toClassOnly: true })
  price: number

  @IsString()
  description: string

  @IsString()
  currency: string

  @IsString()
  image: string
}
