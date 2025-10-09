import { Module } from '@nestjs/common'
import { Kafka, logLevel } from 'kafkajs'
import { ConfigModule, ConfigService } from '@nestjs/config'
import { KafkaProducer } from './kafka.producer'
import { KafkaConsumer } from './kafka.consumer'

@Module({
  imports: [ConfigModule],
  providers: [
    {
      provide: 'KAFKA_BROKER',
      useFactory: (config: ConfigService) =>
        new Kafka({
          brokers: [config.get<string>('KAFKA_BROKER', 'event_bus:9092')],
          logLevel: logLevel.DEBUG,
        }),
      inject: [ConfigService],
    },
    KafkaProducer,
    KafkaConsumer,
  ],
  exports: [KafkaProducer, KafkaConsumer],
})
export class KafkaModule {}
