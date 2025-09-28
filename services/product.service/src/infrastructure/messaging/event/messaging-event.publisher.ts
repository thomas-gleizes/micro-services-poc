import { IEventPublisher } from '@nestjs/cqrs'
import { KafkaProducer } from '../kafka/kafka.producer'
import { Inject, Injectable, Logger, OnModuleInit } from '@nestjs/common'
import { EventStore } from '../../events-store/events-store'
import { EVENT_STORE, EventData } from '../../events-store/event-store.interface'

@Injectable()
export class MessagingEventPublisher implements IEventPublisher<EventData>, OnModuleInit {
  private readonly logger = new Logger('PUBLISHER')

  constructor(
    private readonly publisher: KafkaProducer,
    @Inject(EVENT_STORE)
    private readonly eventStore: EventStore,
  ) {}

  async onModuleInit() {
    await this.publisher.connect()
  }

  async publish(event: EventData) {
    const content = await this.eventStore.saveEvent(event)

    const topic = event.payload.constructor.name
    this.logger.debug(topic)

    return this.publisher.send(topic, content)
  }
}
