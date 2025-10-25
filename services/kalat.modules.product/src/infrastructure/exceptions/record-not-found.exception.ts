import { InfrastructureException } from './infrastructure.exception'

export class RecordNotFoundException extends InfrastructureException {
  constructor() {
    super('Record not found')
  }
}
