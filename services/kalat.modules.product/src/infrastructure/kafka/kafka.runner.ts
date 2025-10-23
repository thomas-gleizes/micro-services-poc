import { Inject, Logger, OnApplicationBootstrap, OnApplicationShutdown } from '@nestjs/common'
import { KafkaConsumer } from './kafka.consumer'
import { KAFKA_CONSUMER, KAFKA_PROJECTION_CONSUMER } from './kafka.token'
import { KafkaProducer } from './kafka.producer'

export class KafkaRunner implements OnApplicationBootstrap, OnApplicationShutdown {
  private readonly logger = new Logger('RUNNER')

  constructor(
    @Inject(KAFKA_CONSUMER)
    private readonly consumer: KafkaConsumer,
    @Inject(KAFKA_PROJECTION_CONSUMER)
    private readonly projectionConsumer: KafkaConsumer,
    private readonly producer: KafkaProducer,
  ) {}

  async onApplicationBootstrap() {
    this.logger.log('Starting consumer ...')

    await Promise.all([this.consumer.run(), this.projectionConsumer.run(), this.producer.connect()])

    this.logger.log('Consumer has started')
  }

  onApplicationShutdown(): any {
    this.consumer.disconnect()
    this.producer.disconnect()
  }
}
