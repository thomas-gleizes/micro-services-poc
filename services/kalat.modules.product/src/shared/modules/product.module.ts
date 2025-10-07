import { Module } from '@nestjs/common'
import { CqrsModule } from '@nestjs/cqrs'
import { TypeOrmModule } from '@nestjs/typeorm'
import { ProductController } from '../../presentation/controllers/product.controller'
import { commandHandlers } from '../../applications/commands'
import { queryHandlers } from '../../applications/queries'
import { PRODUCT_COMMAND_REPOSITORY } from '../../domain/repositories/product-command-repository.interface'
import { ProductCommandRepository } from '../../infrastructure/persistance/repositories/product-command.repository'
import { ReadableProductSchema } from '../../infrastructure/persistance/schemas/readable-product.schema'
import { ProductMapper } from '../../presentation/mappers/product.mapper'
import { EVENT_STORE } from '../../infrastructure/events-store/event-store.interface'
import { EventStore } from '../../infrastructure/events-store/events-store'
import { EventSchema } from '../../infrastructure/persistance/schemas/event.schema'
import { PRODUCT_QUERY_REPOSITORY } from '../../domain/repositories/product-query-repository.interface'
import { ProductQueryRepository } from '../../infrastructure/persistance/repositories/product-query.repository'
import { IDENTIFIANT_GENERATOR } from '../../domain/ports/identifiant-generator.port'
import { IdentifiantGeneratorAdapter } from '../../infrastructure/adapters/identifiant-generator-adapter.service'
import { MessagingModule } from '../../infrastructure/messaging/messaging.module'
import { productProjections } from '../../infrastructure/persistance/projection'

@Module({
  imports: [
    CqrsModule,
    MessagingModule,
    TypeOrmModule.forFeature([ReadableProductSchema, EventSchema]),
  ],
  controllers: [ProductController],
  providers: [
    ProductMapper,
    {
      provide: PRODUCT_QUERY_REPOSITORY,
      useClass: ProductQueryRepository,
    },
    {
      provide: PRODUCT_COMMAND_REPOSITORY,
      useClass: ProductCommandRepository,
    },
    {
      provide: EVENT_STORE,
      useClass: EventStore,
    },
    {
      provide: IDENTIFIANT_GENERATOR,
      useClass: IdentifiantGeneratorAdapter,
    },
    ...commandHandlers,
    ...queryHandlers,
    ...productProjections,
  ],
})
export class ProductModule {}
