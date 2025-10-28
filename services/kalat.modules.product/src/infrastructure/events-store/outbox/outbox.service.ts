import { OutboxEvent, OutboxEventStatus, Prisma } from '@prisma/client'
import { Injectable, Logger } from '@nestjs/common'
import { MessagingPublisher } from '../../messaging/messaging.publisher'
import { EventData, EventPayload } from '../event-store.interface'
import { PrismaService } from '../../../shared/prisma/prisma.service'

@Injectable()
export class OutboxService {
  private readonly logger = new Logger('OUTBOX')

  constructor(
    private readonly publisher: MessagingPublisher,
    private readonly prisma: PrismaService,
  ) {}

  async saveEvents(transaction: Prisma.TransactionClient, events: EventData[]) {
    await transaction.outboxEvent.createMany({
      data: events.map<Prisma.OutboxEventCreateManyInput>((event) => ({
        id: event.id,
        aggregateId: event.aggregateId,
        aggregateType: event.aggregateType,
        type: event.type,
        payload: event.payload,
        version: event.version,
        createdAt: event.createdAt,
        status: OutboxEventStatus.PENDING,
      })),
    })
  }

  async processEvents() {
    const events = await this.reserveEvents()

    if (events.length === 0) return

    this.logger.log(`PROCESS ${events.length}`)

    for (const event of events) {
      try {
        await this.publisher.publishEvent([
          {
            id: event.id,
            aggregateId: event.aggregateId,
            aggregateType: event.aggregateType,
            type: event.type,
            payload: event.payload as EventPayload,
            version: event.version,
            createdAt: event.createdAt,
          },
        ])
        await this.markEventAsProcessed(event)
      } catch (error) {
        this.logger.error(`FAILED TO PROCESS EVENT : ${event.id} - ${error.message}`)
        await this.markAsFailed(event, error)
      }
    }
  }

  async reserveEvents(): Promise<OutboxEvent[]> {
    return this.prisma.$transaction(async (transaction) => {
      const events = await transaction.outboxEvent.findMany({
        where: {
          OR: [
            { status: OutboxEventStatus.PENDING },
            {
              status: OutboxEventStatus.PROCESSING,
              processAt: { lte: new Date(Date.now() - 60 * 1000) },
            },
            {
              status: OutboxEventStatus.FAILED,
              processAt: { lte: new Date(Date.now() - 60 * 1000) },
              retryCount: { lte: 5 },
            },
          ],
        },
        take: 2,
      })

      if (events.length === 0) {
        return []
      }

      await transaction.outboxEvent.updateMany({
        where: { id: { in: events.map((item) => item.id) } },
        data: { status: OutboxEventStatus.PROCESSING, processAt: new Date() },
      })

      return events
    })
  }

  async markEventAsProcessed(event: OutboxEvent) {
    await this.prisma.outboxEvent.update({
      data: { status: OutboxEventStatus.PROCCESED },
      where: { id: event.id },
    })
  }

  async markAsFailed(event: OutboxEvent, error: Error) {
    await this.prisma.outboxEvent.update({
      data: {
        status: OutboxEventStatus.FAILED,
        message: error.message,
        retryCount: { increment: 1 },
      },
      where: { id: event.id },
    })
  }
}
