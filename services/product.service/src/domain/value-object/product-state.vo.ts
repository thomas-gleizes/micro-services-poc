export enum ProductStateValues {
  CREATED = 'CREATED',
  UPDATED = 'UPDATED',
  DISABLED = 'DISABLED',
  ENABLED = 'ENABLED',
  ARCHIVED = 'ARCHIVED',
}

export class ProductState {
  constructor(private readonly state: ProductStateValues) {}

  static created(): ProductState {
    return new ProductState(ProductStateValues.CREATED)
  }

  static updated(): ProductState {
    return new ProductState(ProductStateValues.UPDATED)
  }

  static disabled(): ProductState {
    return new ProductState(ProductStateValues.DISABLED)
  }

  static enabled(): ProductState {
    return new ProductState(ProductStateValues.ENABLED)
  }

  static archived(): ProductState {
    return new ProductState(ProductStateValues.ARCHIVED)
  }

  getValue(): ProductStateValues {
    return this.state
  }

  isCreated(): boolean {
    return this.state === ProductStateValues.CREATED
  }

  isUpdated(): boolean {
    return this.state === ProductStateValues.UPDATED
  }

  isEnabled(): boolean {
    return this.state === ProductStateValues.ENABLED
  }

  isDisabled(): boolean {
    return this.state === ProductStateValues.DISABLED
  }

  isArchived(): boolean {
    return this.state === ProductStateValues.ARCHIVED
  }

  canDisable() {
    return this.isEnabled()
  }

  canArchive() {
    return this.isDisabled() || this.isCreated() || this.isUpdated()
  }

  canUpdate() {
    return this.isDisabled() || this.isUpdated() || this.isCreated()
  }

  canEnable() {
    return this.isCreated() || this.isUpdated() || this.isDisabled()
  }
}
