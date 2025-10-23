import { Global, Module } from '@nestjs/common'
import { Kafka, logLevel } from 'kafkajs'
import { ConfigService } from '@nestjs/config'
import { KafkaProducer } from './kafka.producer'
import { KafkaConsumer } from './kafka.consumer'
import { KAFKA_BROKER, KAFKA_CONSUMER, KAFKA_PROJECTION_CONSUMER } from './kafka.token'

@Module({
  imports: [],
  providers: [
    {
      provide: KAFKA_BROKER,
      useFactory: (config: ConfigService) =>
        new Kafka({
          brokers: config.getOrThrow<string>('KAFKA_BROKERS').split(','),
          logLevel: logLevel.WARN,
        }),
      inject: [ConfigService],
    },
    KafkaProducer,
    {
      provide: KAFKA_PROJECTION_CONSUMER,
      useFactory: (broker: Kafka, config: ConfigService) =>
        new KafkaConsumer(
          broker,
          config,
          `${config.getOrThrow('KAFKA_CONSUMER_GROUP')}_projection`,
        ),
      inject: [KAFKA_BROKER, ConfigService],
    },
    {
      provide: KAFKA_CONSUMER,
      useFactory: (broker: Kafka, config: ConfigService) =>
        new KafkaConsumer(broker, config, config.getOrThrow('KAFKA_CONSUMER_GROUP')),
      inject: [KAFKA_BROKER, ConfigService],
    },
  ],
  exports: [KafkaProducer, KAFKA_PROJECTION_CONSUMER, KAFKA_CONSUMER],
})
export class KafkaModule {}
