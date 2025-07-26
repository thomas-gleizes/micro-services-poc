import { IEvent, IEventHandler } from '@nestjs/cqrs'
import { Type } from '@nestjs/common'
import { ProductCreatedHandler } from './products/product-created/product-created.handler'
import { ProductUpdatedHandler } from './products/product-updated/product-updated.handler'
import { ProductDeletedHandler } from './products/product-deleted/product-deleted.handler'
import { ProductCreatedEvent } from './products/product-created/product-created.event'
import { ProductUpdatedEvent } from './products/product-updated/product-updated.event'
import { ProductDeletedEvent } from './products/product-deleted/product-deleted.event'

export const productEventHandlers: Type<IEventHandler>[] = [
  ProductCreatedHandler,
  ProductUpdatedHandler,
  ProductDeletedHandler,
]

export const productEvents: Type<IEvent>[] = [ProductCreatedEvent, ProductUpdatedEvent, ProductDeletedEvent]
