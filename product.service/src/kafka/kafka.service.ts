import { Consumer, Producer, Admin } from 'kafkajs'
import { Injectable, Inject, OnModuleInit, OnModuleDestroy } from '@nestjs/common'

@Injectable()
export class KafkaService implements OnModuleInit, OnModuleDestroy {
  constructor(
    @Inject('KAFKA_PRODUCER') private readonly _producer: Producer,
    @Inject('KAFKA_CONSUMER') private readonly _consumer: Consumer,
    @Inject('KAFKA_ADMIN') private readonly _admin: Admin,
  ) {}

  async onModuleInit() {
    await this._producer.connect()
    await this._consumer.connect()
    await this._admin.connect()
  }

  async onModuleDestroy() {
    await this._producer.disconnect()
    await this._consumer.disconnect()
    await this._admin.disconnect()
  }

  private async setupTopics(topic) {
    const topics = await this._admin.listTopics()
    if (!topics.includes(topic)) {
      console.log(`Creating topic: ${topic}`)
      await this._admin.createTopics({
        topics: [{ topic, numPartitions: 1, replicationFactor: 1 }],
      })
    }
  }

  async emit(topic: string, message: any) {
    console.log('Emit', topic, message)
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
      eachMessage: async ({ message }) => {
        if (message.value) {
          await callback(JSON.parse(message.value.toString()))
        }
      },
    })
  }
}
