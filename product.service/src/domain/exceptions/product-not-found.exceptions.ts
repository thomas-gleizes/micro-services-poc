import { DomainNotFoundExceptions } from './domain-not-found.exceptions'

export class ProductNotFoundException extends DomainNotFoundExceptions {
  constructor() {
    super('Product not found')
  }
}
