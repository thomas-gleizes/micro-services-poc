import { DomainException } from './domain.exception'

export class DomainNotFoundExceptions extends DomainException {
  constructor(message: string = 'resource not found') {
    super(message)
  }
}
