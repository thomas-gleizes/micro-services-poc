import { Injectable, NestInterceptor, ExecutionContext, CallHandler, Logger } from '@nestjs/common'
import { Observable, throwError } from 'rxjs'
import { tap, catchError } from 'rxjs/operators'

@Injectable()
export class LoggingInterceptor implements NestInterceptor {
  private readonly logger = new Logger('HTTP')

  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
    const req = context.switchToHttp().getRequest()
    const method = req.method
    const url = req.originalUrl
    const now = Date.now()

    return next.handle().pipe(
      tap(() => {
        const response = context.switchToHttp().getResponse()
        const delay = Date.now() - now
        const statusCode = response.statusCode

        if (statusCode >= 400) {
          this.logger.error(`${method} ${url} ${statusCode} - ${delay}ms`)
        } else {
          this.logger.log(`${method} ${url} ${statusCode} - ${delay}ms`)
        }
      }),
      catchError((error) => {
        const delay = Date.now() - now
        this.logger.error(
          `${method} ${url} - ${error.constructor.name ?? 'Unknow Error'} - ${delay}ms`,
          error.stack,
        )
        return throwError(error)
      }),
    )
  }
}
