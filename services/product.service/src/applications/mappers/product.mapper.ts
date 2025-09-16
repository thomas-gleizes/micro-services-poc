import { Injectable } from '@nestjs/common'
import { ReadProductModel } from '../../domain/repositories/product-query.repository'
import { ProductResponseDto } from '../../presentation/dtos/output/product-response.dto'
import { ProductProps } from '../../domain/entities/product.entity'

@Injectable()
export class ProductMapper {
  fromReadModel(model: ReadProductModel): ProductResponseDto {
    const dto = new ProductResponseDto()

    dto.id = model.id
    dto.name = model.name

    return dto
  }

  fromEntity(entity: ProductProps): ProductResponseDto {
    const dto = new ProductResponseDto()

    dto.id = entity.id
    dto.name = entity.name

    return dto
  }
}
