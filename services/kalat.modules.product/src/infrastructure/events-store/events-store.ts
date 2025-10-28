import { randomUUID } from 'node:crypto'
import { Injectable } from '@nestjs/common'
import { EventData, EventPayload, IEventStore } from './event-store.interface'
import { InfrastructureException } from '../exceptions/infrastructure.exception'
import { AggregateRoot } from '../../shared/aggregate-root.interface'
import { PrismaService } from '../../shared/prisma/prisma.service'
import { OutboxService } from './outbox/outbox.service'
import { EventPublisher } from '@nestjs/cqrs'

@Injectable()
export class EventStore implements IEventStore {
  constructor(
    private readonly prisma: PrismaService,
    private readonly outbox: OutboxService,
    private readonly publisher: EventPublisher,
  ) {}

  async findEventByAggregate(aggregateId: string): Promise<EventData[]> {
    const events = await this.prisma.event.findMany({
      where: { aggregateId },
      orderBy: { version: 'asc' },
    })

    return events.map((event) => ({
      id: event.id,
      type: event.type,
      version: event.version,
      payload: event.payload as EventPayload,
      aggregateId: event.aggregateId,
      aggregateType: event.aggregateType,
      createdAt: event.createdAt,
    }))
  }

  async save(aggregate: AggregateRoot): Promise<void> {
    await this.prisma.$transaction(async (transaction) => {
      const uncommittedEvents = aggregate.getUncommittedEvents()

      const eventsPlayed = await transaction.event.count({
        where: { aggregateId: aggregate.getAggregateId() },
      })

      if (aggregate.version > 1) {
        if (eventsPlayed !== aggregate.version) {
          throw new InfrastructureException('Invalid version')
        }
      }

      const storableEvents: EventData[] = uncommittedEvents.map<EventData>((event, index) => ({
        id: randomUUID(),
        type: event.constructor.name,
        payload: event as EventPayload,
        version: eventsPlayed + index + 1,
        aggregateId: aggregate.getAggregateId(),
        aggregateType: aggregate.getAggregateType(),
        createdAt: new Date(),
      }))

      await transaction.event.createMany({ data: storableEvents })
      await this.outbox.saveEvents(transaction, storableEvents)

      this.publisher.mergeObjectContext(aggregate).commit()

      return storableEvents
    })
  }
}
