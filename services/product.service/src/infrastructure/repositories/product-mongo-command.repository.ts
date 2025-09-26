import { ProductAggregate } from 'src/domain/aggregates/product.aggregate'
import { IProductCommandRepository } from '../../domain/repositories/product-command-repository.interface'
import { Inject, Injectable } from '@nestjs/common'
import { ProductId } from '../../domain/value-object/product-id.vo'
import { EVENT_STORE, IEventStore } from '../events-store/event-store.interface'

@Injectable()
export class ProductMongoCommandRepository implements IProductCommandRepository {
  constructor(
    @Inject(EVENT_STORE)
    private readonly eventStore: IEventStore,
  ) {}

  async findById(id: ProductId): Promise<ProductAggregate | null> {
    const events = await this.eventStore.findEventByAggregate(id.toString())

    if (events.length <= 0) return null

    const aggregate = new ProductAggregate()

    for (const event of events) {
      aggregate.applyEvent(event.type, event.payload)
    }

    return aggregate
  }

  async save(aggregate: ProductAggregate): Promise<void> {
    const events = aggregate.getUncommittedEvents()

    await this.eventStore.save(
      aggregate.id.toString(),
      ProductAggregate.name,
      events,
      Math.max(0, aggregate.version - events.length),
    )
  }
}
