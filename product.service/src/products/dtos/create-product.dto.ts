import { IsNumber, IsString } from 'class-validator'
import { Transform } from 'class-transformer'

export class CreateProductDto {
  @IsString()
  name: string

  @IsNumber()
  @Transform(({ value }) => parseInt(value, 10), { toClassOnly: true })
  price: number
}
