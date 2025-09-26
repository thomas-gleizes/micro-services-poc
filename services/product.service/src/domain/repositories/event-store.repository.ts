import { DomainEvent } from '../events/domain-event'

export interface EventStoreRepository {
  findByType(type: string): Promise<DomainEvent[]>

  findByAggregate(type: string): Promise<DomainEvent[]>

  save(event: DomainEvent): Promise<void>
}
