import { Module } from '@nestjs/common'
import { Kafka, logLevel } from 'kafkajs'
import { KafkaProducer } from './kafka.producer'
import { KafkaConsumer } from './kafka.consumer'
import { KafkaCommandPublisher } from './kafka-command.publisher'

@Module({
  providers: [
    {
      provide: 'KAFKA_PRODUCER',
      useFactory: () =>
        new Kafka({
          brokers: ['event_bus:9092'],
          logLevel: logLevel.WARN,
        }).producer({ allowAutoTopicCreation: true }),
    },
    {
      provide: 'KAFKA_CONSUMER',
      useFactory: () =>
        new Kafka({
          brokers: ['event_bus:9092'],
          logLevel: logLevel.WARN,
        }).consumer({ allowAutoTopicCreation: true, groupId: 'product.service' }),
    },
    KafkaProducer,
    KafkaConsumer,
    KafkaCommandPublisher,
  ],
  exports: [KafkaProducer, KafkaConsumer, KafkaCommandPublisher],
})
export class KafkaModule {}
