import { IQueryHandler } from '@nestjs/cqrs'
import { Type } from '@nestjs/common'
import { ReadProductsHandler } from './read-products/read-products.handler'
import { ReadProductHandler } from './read-product/read-product.handler'

export const queryHandlers: Type<IQueryHandler>[] = [ReadProductsHandler, ReadProductHandler]
