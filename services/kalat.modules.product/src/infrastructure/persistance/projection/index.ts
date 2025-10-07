import { Type } from '@nestjs/common'
import { IEvent } from '@nestjs/cqrs'
import { IProjectionHandler } from '../../messaging/event/projection.decorator'
import { ProductCreatedProjection } from './product-created.projection'
import { ProductDisabledProjection } from './product-disabled.projection'
import { ProductEnabledProjection } from './product-enabled.projection'
import { ProductArchivedProjection } from './product-archived.projection'
import { ProductUpdatedProjection } from './product-updated.projection'

export const productProjections: Type<IProjectionHandler<IEvent>>[] = [
  ProductCreatedProjection,
  ProductDisabledProjection,
  ProductEnabledProjection,
  ProductArchivedProjection,
  ProductUpdatedProjection,
]
