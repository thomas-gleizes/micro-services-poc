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

  async publishEvent<I extends IEvent>(event: EventData<I>) {
    const topic = `${this.messagingBase}.domain.${event.aggregateType}`

    const createdBy = this.config.getOrThrow<string>('SERVICE_NAME')

    return this.producer.send(topic, {
      id: event.id,
      version: event.version,
      aggregate_id: event.aggregateId,
      state: event.type,
      content_type: `${this.messagingBase}.domain.${event.type}`,
      payload: event.payload,
      created_by: createdBy,
      created_at: event.created_at.toISOString(),
      metadata: {
        tenant_id: '1',
      },
    })
  }
}
