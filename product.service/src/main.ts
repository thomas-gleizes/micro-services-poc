import { NestFactory } from '@nestjs/core'
import { AppModule } from './app.module'
import { ValidationPipe } from '@nestjs/common'
import { HttpLoggingInterceptor } from './shared/logger.interceptor'

async function bootstrap() {
  const app = await NestFactory.create(AppModule)

  app.useGlobalPipes(new ValidationPipe({ transform: true }))
  app.useGlobalInterceptors(new HttpLoggingInterceptor())

  await app.listen(process.env.PORT ?? 3000)
}

void bootstrap()
