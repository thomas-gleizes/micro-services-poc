import { DomainException } from './domain.execption'

export class ProductNotFoundException extends DomainException {
  constructor() {
    super('Product not found')
  }
}
