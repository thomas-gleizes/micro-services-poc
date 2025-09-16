import { ApiProperty } from '@nestjs/swagger'

export class ProductResponseDto {
  @ApiProperty({ type: 'string' })
  id: string

  @ApiProperty({ type: 'string' })
  name: string
}
