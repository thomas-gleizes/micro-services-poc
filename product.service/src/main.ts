import { NestFactory } from '@nestjs/core'
import { ValidationPipe } from '@nestjs/common'
import { MicroserviceOptions, Transport } from '@nestjs/microservices'
import { logLevel } from 'kafkajs'
import { ConfigService } from '@nestjs/config'
import { AppModule } from './app.module'
import { HttpLoggingInterceptor } from './shared/http-logging-interceptor'

async function bootstrap() {
  const app = await NestFactory.create(AppModule)
  const config = app.get(ConfigService)

  app.useGlobalPipes(new ValidationPipe({ transform: true }))
  app.useGlobalInterceptors(new HttpLoggingInterceptor())

  app.connectMicroservice<MicroserviceOptions>({
    transport: Transport.KAFKA,
    options: {
      client: {
        clientId: 'product_service_consumer',
        brokers: [config.get<string>('KAFKA_BROKER', 'event_bus:9092')],
        logLevel: logLevel.ERROR,
      },
      consumer: {
        groupId: config.get<string>('KAFKA_GROUP_ID', 'product_service_consumer'),
        allowAutoTopicCreation: true,
      },
      producer: {
        allowAutoTopicCreation: true,
      },
    },
  })

  await app.startAllMicroservices()
  await app.listen(config.get<number>('PORT', 3000))
}

void bootstrap()
