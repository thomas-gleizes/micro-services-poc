import { randomUUID } from 'node:crypto'
import { Injectable } from '@nestjs/common'
import { InjectRepository } from '@nestjs/typeorm'
import { DataSource, Repository } from 'typeorm'
import { DomainEvent, IEventStore } from './event-store.interface'
import { EventSchema } from '../persistance/schemas/event.schema'
import { InfrastructureException } from '../exceptions/infrastructure.exception'
import { AggregateRoot } from '../../shared/aggregate-root.interface'
import { MessagingEventPublisher } from '../messaging/event/messaging-event.publisher'

@Injectable()
export class EventStore implements IEventStore {
  constructor(
    private readonly source: DataSource,
    @InjectRepository(EventSchema)
    private readonly repository: Repository<EventSchema>,
    private readonly publisher: MessagingEventPublisher,
  ) {}

  async findEventByAggregate(aggregateId: string): Promise<DomainEvent[]> {
    const events = await this.repository.find({ where: { aggregateId }, order: { version: 'ASC' } })

    return events.map((event) => ({
      id: event.id,
      type: event.type,
      version: event.version,
      data: event.data,
      aggregateId: event.aggregateId,
      aggregateType: event.aggregateType,
      timestamp: event.timestamp,
    }))
  }

  async save(aggregate: AggregateRoot): Promise<void> {
    const runner = this.source.createQueryRunner()
    await runner.connect()
    await runner.startTransaction()

    try {
      const events = aggregate.getUncommittedEvents().map((event, index) => ({ event, index }))

      const eventsPlayed = await runner.manager.find(EventSchema, {
        where: { aggregateId: aggregate.getAggregateId() },
      })

      if (aggregate.version > 1) {
        if (eventsPlayed.length !== aggregate.version) {
          throw new InfrastructureException('Invalid version')
        }
      }

      for (const { event, index } of events) {
        const record = await runner.manager.save(EventSchema, {
          id: randomUUID(),
          type: event.constructor.name,
          aggregateId: aggregate.getAggregateId(),
          aggregateType: aggregate.getAggregateType(),
          data: event,
          version: eventsPlayed.length + index + 1,
        })

        await this.publisher.publish(record)
      }

      await runner.commitTransaction()
    } catch (error) {
      await runner.rollbackTransaction()
      throw error
    } finally {
      await runner.release()
    }
  }
}
