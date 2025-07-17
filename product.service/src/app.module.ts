import { Module } from '@nestjs/common'
import { CqrsModule } from '@nestjs/cqrs'
import { ConfigModule } from '@nestjs/config'
import { ProductModule } from './shared/modules/product.module'
import { MessagingModule } from './shared/messaging/messaging.module'

@Module({
  imports: [ConfigModule.forRoot(), CqrsModule.forRoot(), ProductModule, MessagingModule],
  providers: [],
})
export class AppModule {}
