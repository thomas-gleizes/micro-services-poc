import { IEvent } from '@nestjs/cqrs'

export interface DomainEvent {
  id: string
  type: string
  aggregateId: string
  payload: IEvent
  metadata: { [key: string]: unknown }
  timestamp: Date
}
