import { Module } from '@nestjs/common'
import { CqrsModule } from '@nestjs/cqrs'
import { ProductModule } from './shared/modules/product.module'
import { PrismaModule } from './shared/prisma/prisma.module'

@Module({
  imports: [CqrsModule.forRoot(), ProductModule, PrismaModule],
  providers: [],
})
export class AppModule {}
