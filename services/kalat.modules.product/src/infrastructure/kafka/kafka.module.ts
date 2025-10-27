import { Global, Module } from '@nestjs/common'
import { Kafka } from 'kafkajs'
import { ConfigService } from '@nestjs/config'
import { KafkaProducer } from './kafka.producer'
import { KAFKA_BROKER } from './kafka.token'
import { getKafkaConfig } from './kafka.config'

@Global()
@Module({
  imports: [],
  providers: [
    {
      provide: KAFKA_BROKER,
      useFactory: (config: ConfigService) => new Kafka(getKafkaConfig(config).broker),
      inject: [ConfigService],
    },
    KafkaProducer,
  ],
  exports: [KafkaProducer],
})
export class KafkaModule {}
