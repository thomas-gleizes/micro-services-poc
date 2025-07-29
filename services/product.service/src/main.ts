import { NestFactory } from '@nestjs/core'
import { Logger, ValidationPipe } from '@nestjs/common'
import { ConfigService } from '@nestjs/config'
import { AppModule } from './app.module'
import { HttpLoggingInterceptor } from './shared/http-logging-interceptor'
import { DomainExceptionFilters } from './presentation/filters/domain-exception.filters'
import { GlobalExceptionFilters } from './presentation/filters/global-exception.filters'

async function bootstrap() {
  const app = await NestFactory.create(AppModule)
  const config = app.get(ConfigService)
  const logger = new Logger('Main')

  app.useGlobalFilters(new DomainExceptionFilters())
  app.useGlobalFilters(new GlobalExceptionFilters())
  app.useGlobalPipes(new ValidationPipe({ transform: true }))
  app.useGlobalInterceptors(new HttpLoggingInterceptor())

  process.on('SIGTERM', () => {
    logger.debug('SIGTERM received, shutting down gracefully')
    app.close()
  })

  await app.listen(config.get<number>('PORT', 3000))
  logger.debug(`APP STARTED ON PORT ${config.get<number>('PORT')}`)
}

void bootstrap()
