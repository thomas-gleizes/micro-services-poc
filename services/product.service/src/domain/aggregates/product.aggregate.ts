import { ProductCreatedEvent } from '../events/products/product-created/product-created.event'
import { ProductState } from '../value-object/product-state.vo'
import { ProductStatus } from '../value-object/product-status.enum'
import { ProductId } from '../value-object/product-id.vo'
import { ProductArchivedEvent } from '../events/products/product-archived/product-archived.event'
import { DomainException } from '../exceptions/domain.exception'
import { ProductUpdatedEvent } from '../events/products/product-updated/product-updated.event'
import { ProductEnabledEvent } from '../events/products/product-enabled/product-enabled.event'
import { ProductDisabledEvent } from '../events/products/product-disabled/product-disabled.event'
import { AggregateRoot } from '../../infrastructure/messaging/aggregate-root.interface'
import { IEvent } from '@nestjs/cqrs'
import { Logger } from '@nestjs/common'

export class ProductAggregate extends AggregateRoot {
  private readonly logger = new Logger(ProductAggregate.name)

  public eventHandlers = {
    [ProductCreatedEvent.name]: this.onCreated.bind(this),
    [ProductEnabledEvent.name]: this.onEnabled.bind(this),
    [ProductDisabledEvent.name]: this.onDisabled.bind(this),
    [ProductUpdatedEvent.name]: this.onUpdated.bind(this),
    [ProductArchivedEvent.name]: this.onArchived.bind(this),
  }

  private _state: ProductState

  private _id: ProductId
  private _name: string
  private _description: string
  private _price: number
  private _currency: string
  private _status: ProductStatus
  private _createdAt: Date
  private _updatedAt: Date

  static create(id: ProductId, name: string, description: string, price: number, currency: string) {
    const aggregate = new ProductAggregate()

    aggregate._id = id
    aggregate._name = name
    aggregate._description = description
    aggregate._price = price
    aggregate._currency = currency
    aggregate._status = ProductStatus.UNAVAILABLE
    aggregate._createdAt = new Date()
    aggregate._updatedAt = new Date()

    aggregate._state = ProductState.created()

    aggregate.apply(
      new ProductCreatedEvent(
        aggregate._id.toString(),
        aggregate._name,
        aggregate._description,
        aggregate._price,
        aggregate._currency,
        aggregate._status,
        aggregate._createdAt,
        aggregate._updatedAt,
      ),
    )

    return aggregate
  }

  enable() {
    if (!this.state.canEnable()) throw new DomainException("Can't enable this aggregate")

    this._status = ProductStatus.AVAILABLE
    this._state = ProductState.enabled()

    this.apply(new ProductEnabledEvent(this._id.toString(), this._status))
  }

  disable() {
    if (!this.state.canDisable()) throw new DomainException("Can't disabled this aggregate")

    this._status = ProductStatus.UNAVAILABLE
    this._state = ProductState.disabled()

    this.apply(new ProductDisabledEvent(this._id.toString(), this._status))
  }

  update(name: string, description: string, price: number, currency: string) {
    if (!this.state.canUpdate()) throw new DomainException("Can't update this aggregate")

    this._name = name
    this._description = description
    this._price = price
    this._currency = currency
    this._updatedAt = new Date()

    this._state = ProductState.updated()

    this.apply(
      new ProductUpdatedEvent(
        this._id.toString(),
        this._name,
        this._description,
        this._price,
        this._currency,
        this._updatedAt,
      ),
    )
  }

  archive() {
    if (!this.state.canArchive()) throw new DomainException("Can't archived this aggregate")

    this._state = ProductState.archived()

    this.apply(new ProductArchivedEvent(this._id.toString()))
  }

  applyEvent(type: string, event: IEvent) {
    const handler = this.eventHandlers[type]

    if (!handler) {
      throw new DomainException(`handler not found: "${event.constructor.name}"`)
    }

    handler(event)
  }

  onCreated(event: ProductCreatedEvent) {
    this._id = new ProductId(event.productId)
    this._name = event.name
    this._description = event.description
    this._price = event.price
    this._currency = event.currency
    this._status = event.status as ProductStatus
    this._createdAt = event.createdAt
    this._updatedAt = event.updatedAt

    this._state = ProductState.created()
  }

  onEnabled(event: ProductEnabledEvent) {
    this._status = event.status

    this._state = ProductState.enabled()
  }

  onDisabled(event: ProductDisabledEvent) {
    this._status = event.status

    this._state = ProductState.disabled()
  }

  onUpdated(event: ProductUpdatedEvent) {
    this._name = event.name
    this._description = event.description
    this._price = event.price
    this._currency = event.currency
    this._updatedAt = event.updatedAt

    this._state = ProductState.updated()
  }

  onArchived(event: ProductArchivedEvent) {
    this._state = ProductState.archived()
  }

  get id(): ProductId {
    return this._id
  }

  get name(): string {
    return this._name
  }

  get description(): string {
    return this._description
  }

  get price(): number {
    return this._price
  }

  get currency(): string {
    return this._currency
  }

  get status(): ProductStatus {
    return this._status
  }

  get createdAt(): Date {
    return this._createdAt
  }

  get updatedAt(): Date {
    return this._updatedAt
  }

  get state() {
    return this._state
  }
}
