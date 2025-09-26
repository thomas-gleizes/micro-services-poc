import { Module, OnModuleInit } from '@nestjs/common'
import { ConfigModule, ConfigService } from '@nestjs/config'
import { ProductModule } from './shared/modules/product.module'
import { HealthController } from './presentation/controllers/health.controller'
import { KafkaModule } from './infrastructure/messaging/kafka/kafka.module'
import { KafkaConsumer } from './infrastructure/messaging/kafka/kafka.consumer'
import { envSchema } from './infrastructure/config/environement/env'
import { TypeOrmModule } from '@nestjs/typeorm'
import { CqrsModule } from '@nestjs/cqrs'
import { MessagingModule } from './infrastructure/messaging/messaging.module'
import { ProductSchema } from './infrastructure/schemas/product.schema'
import { EventSchema } from './infrastructure/schemas/event.schema'

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true, validationSchema: envSchema }),
    TypeOrmModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (config: ConfigService) => ({
        type: 'mongodb',
        url: config.get<string>('DATABASE_URL'),
        entities: [ProductSchema, EventSchema],
        synchronize: true,
      }),
    }),
    CqrsModule,
    MessagingModule,
    KafkaModule,
    ProductModule,
  ],
  providers: [],
  controllers: [HealthController],
})
export class AppModule implements OnModuleInit {
  constructor(private readonly consumer: KafkaConsumer) {}

  async onModuleInit() {
    await this.consumer.run()
  }
}
