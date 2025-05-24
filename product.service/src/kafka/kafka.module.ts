import { Module } from '@nestjs/common'
import { Kafka } from 'kafkajs'

@Module({
  providers: [
    {
      provide: 'KAFKA_PRODUCER',
      useFactory: () => new Kafka({ brokers: ['event_bus:9092'] }).producer(),
    },
    {
      provide: 'KAFKA_CONSUMER',
      useFactory: () => new Kafka({ brokers: ['event_bus:9092'] }).consumer({ groupId: 'product-service' }),
    },
    {
      provide: 'KAFKA_ADMIN',
      useFactory: () => new Kafka({ brokers: ['event_bus:9092'] }).admin(),
    },
  ],
  exports: ['KAFKA_PRODUCER', 'KAFKA_CONSUMER', 'KAFKA_ADMIN'],
})
export class KafkaModule {}
