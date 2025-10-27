import { Injectable } from '@nestjs/common'
import { KafkaProducer } from '../kafka/kafka.producer'
import { EventData } from '../events-store/event-store.interface'
import { DOMAIN_TOPIC, MESSAGING_SERVICE } from './messaging.constants'

@Injectable()
export class MessagingPublisher {
  constructor(private readonly producer: KafkaProducer) {}

  async publishEvent(events: EventData[]) {
    if (events.length === 0) return
    const firstEvent = events[0]

    const topic = `${DOMAIN_TOPIC}.${firstEvent.aggregateType}`
    const createdBy = MESSAGING_SERVICE

    return this.producer.send(
      topic,
      events.map((event) => ({
        id: event.id,
        version: event.version,
        aggregate_id: event.aggregateId,
        state: event.type,
        content_type: `${DOMAIN_TOPIC}.${event.type}`,
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
