import { IsNotEmpty, IsNumber, IsPositive, IsString, MaxLength, MinLength } from 'class-validator'
import { Transform } from 'class-transformer'
import { ApiProperty } from '@nestjs/swagger'

export class CreateProductDto {
  @IsString()
  @ApiProperty({ type: 'string' })
  name: string

  @ApiProperty({ type: 'number' })
  @IsNumber()
  @IsPositive()
  price: number

  @ApiProperty({ type: 'string' })
  @IsString()
  description: string

  @ApiProperty({ type: 'string' })
  @IsString()
  currency: string

  @ApiProperty({ type: 'string' })
  @IsString()
  image: string
}
