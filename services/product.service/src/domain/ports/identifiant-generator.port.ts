export const IDENTIFIANT_GENERATOR = Symbol('IDENTIFIANT_GENERATOR')

export interface IdentifiantGeneratorPort {
  generateId(): string
}
