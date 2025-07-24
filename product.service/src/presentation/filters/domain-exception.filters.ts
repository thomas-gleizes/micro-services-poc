import { ArgumentsHost, Catch, ExceptionFilter, HttpStatus } from '@nestjs/common'
import { DomainException } from '../../domain/exceptions/domain.exception'
import { DomainNotFoundExceptions } from '../../domain/exceptions/domain-not-found.exceptions'

@Catch(DomainException)
export class DomainExceptionFilters implements ExceptionFilter {
  catch(exception: DomainException, host: ArgumentsHost) {
    const ctx = host.switchToHttp()
    const response = ctx.getResponse()

    response.status(HttpStatus.BAD_REQUEST)

    if (exception instanceof DomainNotFoundExceptions) {
      response.status(HttpStatus.NOT_FOUND)
    }

    return response.json({
      message: exception.message,
      name: exception.name,
    })
  }
}
