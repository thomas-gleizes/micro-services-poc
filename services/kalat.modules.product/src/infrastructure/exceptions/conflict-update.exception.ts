import { InfrastructureException } from './infrastructure.exception'

export class ConflictUpdateException extends InfrastructureException {
  constructor() {
    super('conflit update exception : ressource was updated by another process')
  }
}
