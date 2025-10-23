import { Module } from '@nestjs/common'
import { ConfigModule, ConfigService } from '@nestjs/config'
import { ProductModule } from './shared/modules/product.module'
import { HealthController } from './presentation/controllers/health.controller'
import { envSchema } from './infrastructure/config/environement/env'
import { TypeOrmModule } from '@nestjs/typeorm'
import { CqrsModule } from '@nestjs/cqrs'
import { ReadableProductSchema } from './infrastructure/persistance/schemas/readable-product.schema'
import { EventSchema } from './infrastructure/persistance/schemas/event.schema'
import { MessagingModule } from './infrastructure/messaging/messaging.module'
import { EventStoreModule } from './infrastructure/events-store/event-store.module'

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true, validationSchema: envSchema }),
    TypeOrmModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (config: ConfigService) => ({
        type: 'mongodb',
        url: config.getOrThrow<string>('DATABASE_URL'),
        entities: [ReadableProductSchema, EventSchema],
        synchronize: true,
      }),
    }),
    EventStoreModule,
    MessagingModule,
    CqrsModule,
    ProductModule,
  ],
  providers: [],
  controllers: [HealthController],
})
export class AppModule {}
