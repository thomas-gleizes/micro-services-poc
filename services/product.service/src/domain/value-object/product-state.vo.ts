export enum ProductStateEnum {
  CREATED = 'CREATED',
  UPDATED = 'UPDATED',
  ARCHIVED = 'ARCHIVED',
}

export class ProductState {
  constructor(private readonly status: ProductStateEnum) {}

  static createCreated(): ProductState {
    return new ProductState(ProductStateEnum.CREATED)
  }

  static createUpdated(): ProductState {
    return new ProductState(ProductStateEnum.UPDATED)
  }

  static createDeleted(): ProductState {
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

  isArchived(): boolean {
    return this.status === ProductStateEnum.ARCHIVED
  }
}
