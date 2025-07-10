import { IEventHandler } from '@nestjs/cqrs'
import { Type } from '@nestjs/common'
import { ProductCreatedHandler } from './products/product-created/product-created.handler'
import { ProductUpdatedHandler } from './products/product-updated/product-updated.handler'
import { ProductDeletedHandler } from './products/product-deleted/product-deleted.handler'

export const eventHandlers: Type<IEventHandler>[] = [
  ProductCreatedHandler,
  ProductUpdatedHandler,
  ProductDeletedHandler,
]
