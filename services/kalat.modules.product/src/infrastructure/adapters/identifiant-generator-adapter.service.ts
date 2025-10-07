import { randomUUID } from 'node:crypto'
import { IdentifiantGeneratorPort } from '../../domain/ports/identifiant-generator.port'

export class IdentifiantGeneratorAdapter implements IdentifiantGeneratorPort {
  generateId(): string {
    return randomUUID()
  }
}
