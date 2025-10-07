import { Injectable, Logger, OnApplicationBootstrap, OnApplicationShutdown } from '@nestjs/common'
import { KafkaProducer } from '../kafka/kafka.producer'
import { DomainEvent } from '../../events-store/event-store.interface'

@Injectable()
export class MessagingEventPublisher implements OnApplicationBootstrap, OnApplicationShutdown {
  private readonly logger = new Logger('PUBLISHER')

  constructor(private readonly producer: KafkaProducer) {}

  async onApplicationBootstrap() {
    await this.producer.connect()
  }

  async onApplicationShutdown() {
    await this.producer.disconnect()
  }

  async publish(event: DomainEvent) {
    return this.producer.send(event.type, event)
  }
}
