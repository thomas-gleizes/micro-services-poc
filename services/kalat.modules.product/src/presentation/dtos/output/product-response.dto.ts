import { ApiProperty } from '@nestjs/swagger'

export class ProductResponseDto {
  @ApiProperty({ type: 'string' })
  id: string

  @ApiProperty({ type: 'string' })
  name: string

  @ApiProperty({ type: 'string' })
  description: string

  @ApiProperty({ type: 'number' })
  price: number

  @ApiProperty({ type: 'string' })
  currency: string

  @ApiProperty({ type: 'boolean' })
  isAvailable: boolean

  @ApiProperty({ type: 'string' })
  createdAt: string

  @ApiProperty({ type: 'string' })
  updatedAt: string
}
