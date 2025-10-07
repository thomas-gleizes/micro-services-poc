import { IEvent } from '@nestjs/cqrs'
import { AggregateRoot } from '../../shared/aggregate-root.interface'

export interface DomainEvent<Data extends IEvent = IEvent> {
  // id of event
  id: string

  // type of event
  type: string

  // version of event
  version: number

  // content of event
  data: Data

  // id of aggregate
  aggregateId: string

  // aggregateType (product, ...)
  aggregateType: string

  // date of producing event
  timestamp: Date
}

export const EVENT_STORE = Symbol('EVENT_STORE')

export interface IEventStore {
  save(aggregate: AggregateRoot): Promise<void>

  findEventByAggregate(aggregateId: string): Promise<DomainEvent[]>
}
