import { Type } from '@nestjs/common'
import { ICommandHandler } from '@nestjs/cqrs'
import { CreateProductHandler } from './create-product/create-product.handler'
import { UpdateProductHandler } from './update-product/update-product.handler'
import { EnableProductHandler } from './enable-product/enable-product.handler'
import { DisableProductHandler } from './disable-product/disable-product.handler'
import { ArchiveProductHandler } from './archive-product/archive-product.handler'

export const commandHandlers: Type<ICommandHandler>[] = [
  CreateProductHandler,
  UpdateProductHandler,
  EnableProductHandler,
  DisableProductHandler,
  ArchiveProductHandler,
]
