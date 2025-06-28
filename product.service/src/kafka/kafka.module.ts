import { Module } from '@nestjs/common'
import { Kafka, logLevel } from 'kafkajs'

@Module({
  providers: [
    {
      provide: 'KAFKA_CONNECTION',
      useFactory: () => new Kafka({ brokers: ['event_bus:9092'], logLevel: logLevel.WARN }),
    },
  ],
  exports: ['KAFKA_CONNECTION'],
})
export class KafkaModule {}
