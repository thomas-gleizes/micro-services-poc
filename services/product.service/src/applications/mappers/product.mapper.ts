import { Injectable } from '@nestjs/common'
import { ProductResponseDto } from '../../presentation/dtos/output/product-response.dto'
import { ProductAggregate } from '../../domain/aggregates/product.aggregate'
import { ProductStatus } from '../../domain/value-object/product-status.enum'
import { ReadProductModel } from '../../domain/repositories/product-query-repository.interface'

@Injectable()
export class ProductMapper {
  fromReadModel(model: ReadProductModel): ProductResponseDto {
    const dto = new ProductResponseDto()

    dto.id = model.id
    dto.name = model.name
    dto.description = model.description
    dto.price = model.price
    dto.isAvailable = model.isAvailable
    dto.createdAt = model.createdAt.toISOString()
    dto.updatedAt = model.updatedAt.toISOString()

    return dto
  }

  fromAggregate(aggregate: ProductAggregate): ProductResponseDto {
    const dto = new ProductResponseDto()

    dto.id = aggregate.id.toString()
    dto.name = aggregate.name
    dto.description = aggregate.description
    dto.price = aggregate.price
    dto.isAvailable = aggregate.status === ProductStatus.AVAILABLE
    dto.createdAt = aggregate.createdAt.toISOString()
    dto.updatedAt = aggregate.updatedAt.toISOString()

    return dto
  }
}
