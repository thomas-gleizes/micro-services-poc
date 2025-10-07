export class ProductId {
  constructor(private readonly id: string) {}

  toString() {
    return this.id.toString()
  }
}
