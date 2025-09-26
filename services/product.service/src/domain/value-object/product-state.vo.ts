export enum ProductStateEnum {
  CREATED = 'CREATED',
  UPDATED = 'UPDATED',
  DISABLED = 'DISABLED',
  ENABLED = 'ENABLED',
  ARCHIVED = 'ARCHIVED',
}

export class ProductState {
  constructor(private readonly status: ProductStateEnum) {}

  static created(): ProductState {
    return new ProductState(ProductStateEnum.CREATED)
  }

  static updated(): ProductState {
    return new ProductState(ProductStateEnum.UPDATED)
  }

  static disabled(): ProductState {
    return new ProductState(ProductStateEnum.DISABLED)
  }

  static enabled(): ProductState {
    return new ProductState(ProductStateEnum.ENABLED)
  }

  static archived(): ProductState {
    return new ProductState(ProductStateEnum.ARCHIVED)
  }

  getValue(): ProductStateEnum {
    return this.status
  }

  isCreated(): boolean {
    return this.status === ProductStateEnum.CREATED
  }

  isUpdated(): boolean {
    return this.status === ProductStateEnum.UPDATED
  }

  isEnabled(): boolean {
    return this.status === ProductStateEnum.ENABLED
  }

  isDisabled(): boolean {
    return this.status === ProductStateEnum.DISABLED
  }

  isArchived(): boolean {
    return this.status === ProductStateEnum.ARCHIVED
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
