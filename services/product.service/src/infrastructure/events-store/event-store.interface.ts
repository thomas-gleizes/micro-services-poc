import { IEvent } from '@nestjs/cqrs'

export interface EventData extends IEvent {
  // id of event
  id: string

  // command or query or domain event
  type: string

  // version of event
  version: number

  // content of event
  payload: IEvent

  // id of aggregate
  aggregateId: string

  // aggregateType (product, ...)
  aggregateType: string

  // date of producing event
  timestamp: Date
}

export const EVENT_STORE = Symbol('EVENT_STORE')

export interface IEventStore {
  save(
    aggregateId: string,
    aggregateType: string,
    event: IEvent[],
    expectVersion?: number,
  ): Promise<void>

  findEventByAggregate(aggregateId: string): Promise<EventData[]>
}
