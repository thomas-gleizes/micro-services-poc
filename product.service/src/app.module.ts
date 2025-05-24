import { Module } from '@nestjs/common'
import { CqrsModule } from '@nestjs/cqrs'
import { ProductModule } from './products/product.module'

@Module({
  imports: [CqrsModule.forRoot(), ProductModule],
})
export class AppModule {}
