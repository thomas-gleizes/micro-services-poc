import { Module } from '@nestjs/common'
import { ConfigModule } from '@nestjs/config'
import { ProductModule } from './shared/modules/product.module'
import { MessagingModule } from './shared/messaging/messaging.module'
import { HealthController } from './presentation/controllers/health.controller'

@Module({
  imports: [ConfigModule.forRoot(), MessagingModule.forRoot(), ProductModule],
  providers: [],
  controllers: [HealthController],
})
export class AppModule {}
