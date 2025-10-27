import { Kafka, Producer } from 'kafkajs'
import { Inject, Injectable, Logger, OnModuleInit } from '@nestjs/common'
import { ConfigService } from '@nestjs/config'
import { Message } from '../messaging/message.interface'
import { KAFKA_BROKER } from './kafka.token'
import { getKafkaConfig } from './kafka.config'

@Injectable()
export class KafkaProducer implements OnModuleInit {
  private readonly _logger = new Logger('PRODUCER')

  private readonly producer: Producer

  constructor(@Inject(KAFKA_BROKER) broker: Kafka, configService: ConfigService) {
    this.producer = broker.producer(getKafkaConfig(configService).producer)
  }

  async onModuleInit() {
    await this.producer.connect()
  }

  async send<M extends Message<any, any>>(topic: string, messages: M[], partitionKey: string) {
    this._logger.debug(topic)

    await this.producer.send({
      topic: topic,
      messages: messages.map((message) => ({ key: partitionKey, value: JSON.stringify(message) })),
    })
  }
}
