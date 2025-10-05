import { IEvent } from '@nestjs/cqrs'
import { Type } from '@nestjs/common'
import { ProductCreatedEvent } from './products/product-created.event'
import { ProductUpdatedEvent } from './products/product-updated.event'
import { ProductArchivedEvent } from './products/product-archived.event'
import { ProductEnabledEvent } from './products/product-enabled.event'
import { ProductDisabledEvent } from './products/product-disabled.event'

export const productEvents: Type<IEvent>[] = [
  ProductCreatedEvent,
  ProductUpdatedEvent,
  ProductEnabledEvent,
  ProductDisabledEvent,
  ProductArchivedEvent,
] as const
