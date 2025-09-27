import { PaginationMetaDto, PaginationResponseDto } from './pagination-response.dto'
import { ProductResponseDto } from './product-response.dto'
import { ApiProperty } from '@nestjs/swagger'

export class ProductsResponseDto implements PaginationResponseDto<ProductResponseDto> {
  @ApiProperty({ type: PaginationMetaDto })
  meta: PaginationMetaDto

  @ApiProperty({ type: [ProductResponseDto] })
  records: ProductResponseDto[]
}
