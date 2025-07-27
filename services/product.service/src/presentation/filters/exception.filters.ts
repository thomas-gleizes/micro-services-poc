import { ArgumentsHost, Catch, ExceptionFilter, HttpStatus } from '@nestjs/common'
import { ConfigService } from '@nestjs/config'

@Catch()
export class ExceptionFilters implements ExceptionFilter {
  constructor(private readonly config: ConfigService) {}

  catch(exception: Error, host: ArgumentsHost) {
    const ctx = host.switchToHttp()
    const response = ctx.getResponse()

    const nodeEnv = this.config.get<string>('NODE_ENV', 'production')

    response.status(HttpStatus.INTERNAL_SERVER_ERROR)

    if (nodeEnv === 'production')
      return response.json({ message: 'Internal server error', name: 'INTERNAL_SERVER_ERROR' })

    return response.json({ message: exception.message, name: exception.name })
  }
}
