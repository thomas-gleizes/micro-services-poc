import { EventHandlerType } from '@nestjs/cqrs'
import { ProductCreatedProjection } from './product-created.projection'
import { ProductDisabledProjection } from './product-disabled.projection'
import { ProductEnabledProjection } from './product-enabled.projection'
import { ProductArchivedProjection } from './product-archived.projection'
import { ProductUpdatedProjection } from './product-updated.projection'

export const productProjections: EventHandlerType[] = [
  ProductCreatedProjection,
  ProductDisabledProjection,
  ProductEnabledProjection,
  ProductArchivedProjection,
  ProductUpdatedProjection,
]
