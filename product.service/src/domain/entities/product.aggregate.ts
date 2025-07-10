import { randomUUID } from 'node:crypto'
import { AggregateRoot } from '@nestjs/cqrs'
import { ProductCreatedEvent } from '../events/products/product-created/product-created.event'
import { ProductStatus } from '../enums/product-status.enum'
import { ProductUpdatedEvent } from '../events/products/product-updated/product-updated.event'
import { ProductDeletedEvent } from '../events/products/product-deleted/product-deleted.event'

export type ProductPrimitives = {
  id: string
  name: string
  description: string
  price: number
  currency: string
  image: string
  status: `${ProductStatus}`
  createdAt: Date
  updatedAt: Date
}

export class ProductAggregate extends AggregateRoot {
  private readonly _id: string
  private _name: string
  private _description: string
  private _price: number
  private _currency: string
  private _image: string
  private readonly _status: ProductStatus
  private readonly _createdAt: Date
  private _updatedAt: Date

  constructor(primitives: ProductPrimitives) {
    super()

    this._id = primitives.id
    this._name = primitives.name
    this._description = primitives.description
    this._price = primitives.price
    this._currency = primitives.currency
    this._image = primitives.image
    this._status = ProductStatus[primitives.status]
    this._createdAt = primitives.createdAt
    this._updatedAt = primitives.updatedAt
  }

  static create(primitives: Omit<ProductPrimitives, 'id' | 'createdAt' | 'updatedAt'>) {
    const aggregate = new ProductAggregate({
      ...primitives,
      id: randomUUID(),
      createdAt: new Date(),
      updatedAt: new Date(),
    })

    aggregate.apply(new ProductCreatedEvent(aggregate.toPrimitives()))

    return aggregate
  }

  toPrimitives(): ProductPrimitives {
    return {
      id: this.id,
      name: this.name,
      description: this.description,
      price: this.price,
      currency: this.currency,
      image: this.image,
      status: this.status.toString() as `${ProductStatus}`,
      createdAt: this.createdAt,
      updatedAt: this.updatedAt,
    }
  }

  update() {
    this.apply(new ProductUpdatedEvent(this.toPrimitives()))
  }

  delete() {
    this.apply(new ProductDeletedEvent(this.id))
  }

  get id(): string {
    return this._id
  }

  get status(): ProductStatus {
    return this._status
  }

  get createdAt(): Date {
    return this._createdAt
  }

  get name(): string {
    return this._name
  }

  set name(value: string) {
    this._name = value
  }

  get description(): string {
    return this._description
  }

  set description(value: string) {
    this._description = value
  }

  get price(): number {
    return this._price
  }

  set price(value: number) {
    this._price = value
  }

  get currency(): string {
    return this._currency
  }

  set currency(value: string) {
    this._currency = value
  }

  get image(): string {
    return this._image
  }

  set image(value: string) {
    this._image = value
  }

  get updatedAt(): Date {
    return this._updatedAt
  }

  set updatedAt(value: Date) {
    this._updatedAt = value
  }
}
