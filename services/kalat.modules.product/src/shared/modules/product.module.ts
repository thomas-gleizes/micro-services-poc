import { Module } from '@nestjs/common'
import { CqrsModule } from '@nestjs/cqrs'
import { ProductController } from '../../presentation/controllers/product.controller'
import { commandHandlers } from '../../applications/commands'
import { queryHandlers } from '../../applications/queries'
import { PRODUCT_COMMAND_REPOSITORY } from '../../domain/repositories/product-command-repository.interface'
import { ProductCommandRepository } from '../../infrastructure/persistance/repositories/product-command.repository'
import { ProductMapper } from '../../presentation/mappers/product.mapper'
import { PRODUCT_QUERY_REPOSITORY } from '../../domain/repositories/product-query-repository.interface'
import { ProductQueryRepository } from '../../infrastructure/persistance/repositories/product-query.repository'
import { IDENTIFIANT_GENERATOR } from '../../domain/ports/identifiant-generator.port'
import { IdentifiantGeneratorAdapter } from '../../infrastructure/adapters/identifiant-generator-adapter.service'
import { productProjections } from '../../infrastructure/persistance/projection'
import { ProductConsumer } from '../../infrastructure/consumers/product.consumer'

@Module({
  imports: [CqrsModule],
  controllers: [ProductController, ProductConsumer],
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
      provide: IDENTIFIANT_GENERATOR,
      useClass: IdentifiantGeneratorAdapter,
    },
    ...commandHandlers,
    ...queryHandlers,
    ...productProjections,
  ],
})
export class ProductModule {}
