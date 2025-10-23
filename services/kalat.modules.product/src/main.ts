import { NestFactory } from '@nestjs/core'
import { LogLevel, ValidationPipe } from '@nestjs/common'
import { ConfigService } from '@nestjs/config'
import { AppModule } from './app.module'
import { HttpLoggingInterceptor } from './presentation/interceptor/http-logging-interceptor'
import { DomainExceptionFilters } from './presentation/exception-filters/domain-exception.filters'
import { GlobalExceptionFilters } from './presentation/exception-filters/global-exception.filters'
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger'

async function bootstrap() {
  const app = await NestFactory.create(AppModule)
  const config = app.get(ConfigService)

  app.useLogger([config.get<LogLevel>('LOG_LEVEL', 'log')])
  app.useGlobalFilters(new DomainExceptionFilters())
  app.useGlobalFilters(new GlobalExceptionFilters())
  app.useGlobalPipes(new ValidationPipe({ transform: true }))
  app.useGlobalInterceptors(new HttpLoggingInterceptor())

  const document = new DocumentBuilder()
    .setTitle('Product Service')
    .setDescription('This service manage products and category')
    .setVersion('1.0')
    .build()

  const documentFactory = () => SwaggerModule.createDocument(app, document)
  SwaggerModule.setup('docs', app, documentFactory, {
    raw: true,
    jsonDocumentUrl: 'docs.json',
    yamlDocumentUrl: 'docs.yaml',
  })

  await app.listen(config.get<number>('PORT', 3000))
}

void bootstrap()
