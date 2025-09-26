import { Injectable } from '@nestjs/common'
import { DataSource, Repository } from 'typeorm'
import { EventData, IEventStore } from './event-store.interface'
import { IEvent } from '@nestjs/cqrs'
import { EventSchema } from '../schemas/event.schema'
import { randomUUID } from 'node:crypto'
import { InfrastructureException } from '../exceptions/infrastructure.exception'
import { InjectRepository } from '@nestjs/typeorm'

@Injectable()
export class EventStore implements IEventStore {
  constructor(
    private readonly source: DataSource,
    @InjectRepository(EventSchema)
    private readonly repository: Repository<EventSchema>,
  ) {}

  async findEventByAggregate(aggregateId: string): Promise<EventData[]> {
    const events = await this.repository.find({ where: { aggregateId }, order: { version: 'ASC' } })

    return events.map((event) => ({
      id: event.id,
      type: event.type,
      version: event.version,
      payload: event.payload,
      aggregateId: event.aggregateId,
      aggregateType: event.aggregateType,
      timestamp: event.timestamp,
    }))
  }

  async save(
    aggregateId: string,
    aggregateType: string,
    events: IEvent[],
    expectVersion?: number,
  ): Promise<void> {
    const runner = this.source.createQueryRunner()
    await runner.connect()
    await runner.startTransaction()

    try {
      const eventVersion = await runner.manager.count(EventSchema, {
        where: { aggregateType },
      })

      if (expectVersion) {
        if (eventVersion !== expectVersion) {
          throw new InfrastructureException('Version de concurrence invalide')
        }
      }

      for (const { event, index } of events.map((event, index) => ({ event, index }))) {
        await runner.manager.save(EventSchema, {
          id: randomUUID(),
          type: event.constructor.name,
          aggregateId: aggregateId,
          aggregateType: aggregateType,
          metadata: {},
          payload: event,
          version: eventVersion + index + 1,
        })
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
