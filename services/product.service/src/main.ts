import { NestFactory } from '@nestjs/core'
import { ValidationPipe } from '@nestjs/common'
import { ConfigService } from '@nestjs/config'
import { AppModule } from './app.module'
import { HttpLoggingInterceptor } from './shared/http-logging-interceptor'
import { DomainExceptionFilters } from './presentation/filters/domain-exception.filters'
import { ExceptionFilters } from './presentation/filters/exception.filters'

async function bootstrap() {
  const app = await NestFactory.create(AppModule)
  const config = app.get(ConfigService)

  app.useGlobalFilters(new DomainExceptionFilters())
  app.useGlobalFilters(new ExceptionFilters(config))
  app.useGlobalPipes(new ValidationPipe({ transform: true }))
  app.useGlobalInterceptors(new HttpLoggingInterceptor())

  process.on('SIGTERM', () => {
    console.log('SIGTERM received, shutting down gracefully')
    app.close()
  })

  await app.listen(config.get<number>('PORT', 3000))
}

void bootstrap()
