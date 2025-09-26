import { Injectable } from '@nestjs/common'
import { ReadProductModel } from '../../domain/repositories/product-query.repository'
import { ProductResponseDto } from '../../presentation/dtos/output/product-response.dto'
import { ProductAggregate } from '../../domain/aggregates/product.aggregate'

@Injectable()
export class ProductMapper {
  fromReadModel(model: ReadProductModel): ProductResponseDto {
    const dto = new ProductResponseDto()

    dto.id = model.id
    dto.name = model.name

    return dto
  }

  fromAggregate(aggregate: ProductAggregate): ProductResponseDto {
    const dto = new ProductResponseDto()

    dto.id = aggregate.id.toString()
    dto.name = aggregate.name

    return dto
  }
}
