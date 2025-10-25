import { AggregateRoot } from '../../shared/aggregate-root.interface'
import { IEvent } from '@nestjs/cqrs'

export type EventPayload = {
  [key: string]: string | number | boolean | EventPayload[] | EventPayload
}

export interface EventData<Payload extends IEvent = EventPayload> {
  // id of event
  id: string

  // type of event
  type: string

  // version of event
  version: number

  // content of event
  payload: Payload

  // id of aggregate
  aggregateId: string

  // aggregateType (product, ...)
  aggregateType: string

  // date of producing event
  createdAt: Date
}

export const EVENT_STORE = Symbol('EVENT_STORE')

export interface IEventStore {
  save(aggregate: AggregateRoot): Promise<void>

  findEventByAggregate(aggregateId: string): Promise<EventData[]>
}
