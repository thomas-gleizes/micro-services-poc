import { DomainNotFoundException } from './domain-not-found.exception'

export class ProductNotFoundException extends DomainNotFoundException {
  constructor() {
    super('Product not found')
  }
}
