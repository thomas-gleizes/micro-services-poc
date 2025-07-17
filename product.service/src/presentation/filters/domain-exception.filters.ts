import { ArgumentsHost, Catch, ExceptionFilter, HttpStatus } from '@nestjs/common'
import { DomainException } from '../../domain/execptions/domain.execption'
import { DomainNotFoundException } from '../../domain/execptions/domain-not-found.exception'

@Catch(DomainException)
export class DomainExceptionFilters implements ExceptionFilter {
  catch(exception: DomainException, host: ArgumentsHost) {
    const ctx = host.switchToHttp()
    const response = ctx.getResponse()

    response.status(HttpStatus.BAD_REQUEST)

    if (exception instanceof DomainNotFoundException) {
      response.status(HttpStatus.NOT_FOUND)
    }

    return response.json({
      message: exception.message,
      name: exception.name,
    })
  }
}
