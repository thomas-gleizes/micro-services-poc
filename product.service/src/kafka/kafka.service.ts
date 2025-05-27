import { Consumer, Producer, Admin } from 'kafkajs'
import { Injectable, Inject, OnModuleInit, OnModuleDestroy, LoggerService, Logger } from '@nestjs/common'

@Injectable()
export class KafkaService implements OnModuleInit, OnModuleDestroy {
  private readonly logger = new Logger(KafkaService.name)

  constructor(
    @Inject('KAFKA_PRODUCER') private readonly _producer: Producer,
    @Inject('KAFKA_CONSUMER') private readonly _consumer: Consumer,
    @Inject('KAFKA_ADMIN') private readonly _admin: Admin,
  ) {}

  async onModuleInit() {
    try {
      await this._producer.connect()
      await this._consumer.connect()
      await this._admin.connect()
      this.logger.log('KafkaService initialized and connected to Kafka')
    } catch (error) {
      this.logger.error('Error initializing KafkaService:', error)
      throw error
    }
  }

  async onModuleDestroy() {
    await this._producer.disconnect()
    await this._consumer.disconnect()
    await this._admin.disconnect()
    this.logger.warn('KafkaService initialized and connected to Kafka')
  }

  private async setupTopics(topic) {
    const topics = await this._admin.listTopics()
    if (!topics.includes(topic)) {
      this.logger.log('Creating topic:', topic)
      await this._admin.createTopics({
        topics: [{ topic }],
      })
    }
  }

  async emit(topic: string, message: any) {
    this.logger.debug(`New event to ${topic} : ${message}`)
    await this._producer.send({
      topic,
      messages: [{ value: JSON.stringify(message) }],
    })
  }

  async subscribe(topic: string) {
    await this.setupTopics(topic)
    await this._consumer.subscribe({ topic, fromBeginning: true })
  }

  async runEachMessage(callback: (message: any) => Promise<void> | void) {
    await this._consumer.run({
      eachMessage: async ({ message, topic }) => {
        this.logger.debug(`Message received ${topic} : ${message}`)
        if (message.value) {
          await callback(JSON.parse(message.value.toString()))
        }
      },
    })
  }
}
