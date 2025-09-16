import { Module, OnModuleInit } from '@nestjs/common'
import { ConfigModule, ConfigService } from '@nestjs/config'
import { ProductModule } from './shared/modules/product.module'
import { MessagingModule } from './shared/messaging/messaging.module'
import { HealthController } from './presentation/controllers/health.controller'
import { KafkaModule } from './shared/kafka/kafka.module'
import { KafkaConsumer } from './shared/kafka/kafka.consumer'
import { envSchema } from './shared/environement/env'
import { TypeOrmModule } from '@nestjs/typeorm'

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true, validationSchema: envSchema }),
    TypeOrmModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (config: ConfigService) => ({
        type: 'mongodb',
        url: config.get<string>('DATABASE_URL'),
        entities: [`${__dirname}/**/*.schema.ts`],
        synchronize: true,
      }),
    }),
    KafkaModule,
    MessagingModule,
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
