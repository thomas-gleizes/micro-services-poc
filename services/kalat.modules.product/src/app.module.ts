import { Module } from '@nestjs/common'
import { ConfigModule } from '@nestjs/config'
import { ProductModule } from './shared/modules/product.module'
import { HealthController } from './presentation/controllers/health.controller'
import { envSchema } from './infrastructure/config/environement/env'
import { MessagingModule } from './infrastructure/messaging/messaging.module'
import { EventStoreModule } from './infrastructure/events-store/event-store.module'
import { PrismaModule } from './shared/prisma/prisma.module'
import { ScheduleModule } from '@nestjs/schedule'

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true, validationSchema: envSchema }),
    ScheduleModule.forRoot(),
    PrismaModule,
    MessagingModule,
    EventStoreModule,
    ProductModule,
  ],
  providers: [],
  controllers: [HealthController],
})
export class AppModule {}
