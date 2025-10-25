import { Inject, Injectable } from '@nestjs/common'
import { KafkaProducer } from '../kafka/kafka.producer'
import { EventData } from '../events-store/event-store.interface'
import { IEvent } from '@nestjs/cqrs'
import { MESSAGING_BASE } from './messaging.token'
import { ConfigService } from '@nestjs/config'

@Injectable()
export class MessagingPublisher {
  constructor(
    private readonly producer: KafkaProducer,
    @Inject(MESSAGING_BASE) private readonly messagingBase: string,
    private readonly config: ConfigService,
  ) {}

  async publishEvent(events: EventData[]) {
    if (events.length === 0) return
    const firstEvent = events[0]

    const topic = `${this.messagingBase}.domain.${firstEvent.aggregateType}`
    const createdBy = this.config.getOrThrow<string>('SERVICE_NAME')

    return this.producer.send(
      topic,
      events.map((event) => ({
        id: event.id,
        version: event.version,
        aggregate_id: event.aggregateId,
        state: event.type,
        content_type: `${this.messagingBase}.domain.${event.type}`,
        payload: event.payload,
        created_by: createdBy,
        created_at: event.createdAt.toISOString(),
        metadata: {
          tenant_id: '1',
        },
      })),
      firstEvent.aggregateId,
    )
  }
}
