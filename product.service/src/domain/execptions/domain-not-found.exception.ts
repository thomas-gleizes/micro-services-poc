import { DomainException } from './domain.execption'

export class DomainNotFoundException extends DomainException {
  constructor(message: string = 'resource not found') {
    super(message)
  }
}
