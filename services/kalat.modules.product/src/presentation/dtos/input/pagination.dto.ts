import { IsNumber, IsOptional, IsPositive } from 'class-validator'
import { ApiProperty } from '@nestjs/swagger'
import { Transform } from 'class-transformer'

export class PaginationDto {
  @ApiProperty({ type: 'number', required: false })
  @IsPositive()
  @IsNumber()
  @IsOptional()
  @Transform(({ value }) => parseInt(value))
  page?: number

  @ApiProperty({ type: 'number', required: false })
  @IsPositive()
  @IsNumber()
  @IsOptional()
  @Transform(({ value }) => parseInt(value))
  limit?: number
}
