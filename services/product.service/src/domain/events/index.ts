import { IEvent, IEventHandler } from '@nestjs/cqrs'
import { Type } from '@nestjs/common'
import { ProductCreatedHandler } from './products/product-created/product-created.handler'
import { ProductUpdatedHandler } from './products/product-updated/product-updated.handler'
import { ProductDeletedHandler } from './products/product-archived/product-deleted.handler'
import { ProductCreatedEvent } from './products/product-created/product-created.event'
import { ProductUpdatedEvent } from './products/product-updated/product-updated.event'
import { ProductArchivedEvent } from './products/product-archived/product-archived.event'
import { ProductEnabledEvent } from './products/product-enabled/product-enabled.event'
import { ProductEnabledHandler } from './products/product-enabled/product-enabled.handler'
import { ProductDisabledHandler } from './products/product-disabled/product-disabled.handler'
import { ProductDisabledEvent } from './products/product-disabled/product-disabled.event'

export const productEventHandlers: Type<IEventHandler>[] = [
  ProductCreatedHandler,
  ProductUpdatedHandler,
  ProductEnabledHandler,
  ProductDisabledHandler,
  ProductDeletedHandler,
]

export const productEvents: Type<IEvent>[] = [
  ProductCreatedEvent,
  ProductUpdatedEvent,
  ProductEnabledEvent,
  ProductDisabledEvent,
  ProductArchivedEvent,
] as const
