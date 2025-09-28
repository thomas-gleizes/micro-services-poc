import { ArgumentsHost, Catch, ExceptionFilter, HttpStatus } from '@nestjs/common'

@Catch()
export class GlobalExceptionFilters implements ExceptionFilter {
  catch(exception: any, host: ArgumentsHost) {
    const ctx = host.switchToHttp()
    const response = ctx.getResponse()

    return response
      .status(HttpStatus.INTERNAL_SERVER_ERROR)
      .json({ message: exception.message, name: exception.name })
  }
}
