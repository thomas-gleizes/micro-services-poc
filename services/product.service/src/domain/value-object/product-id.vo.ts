export class ProductId {
  constructor(public readonly id: string) {}

  toString() {
    return this.id.toString()
  }
}
