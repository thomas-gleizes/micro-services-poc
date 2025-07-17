import { Inject, Injectable } from '@nestjs/common'
import { Admin, Consumer, Kafka } from 'kafkajs'

@Injectable()
export class KafkaConsumer {
  private readonly consumer: Consumer
  private readonly admin: Admin

  constructor(@Inject('KAFKA_BROKER') broker: Kafka) {
    this.consumer = broker.consumer({
      groupId: 'product-service-consumer',
      allowAutoTopicCreation: true,
    })
    this.admin = broker.admin()
  }

  public async connect() {
    await Promise.all([this.consumer.connect(), this.admin.connect()])
  }

  public async subscribe(topic: string) {
    const topics = await this.admin.listTopics()

    if (!topics.includes(topic)) {
      await this.admin.createTopics({ topics: [{ topic: topic }] })
    }

    await this.consumer.stop()
    await this.consumer.subscribe({ topic, fromBeginning: true })
  }

  public async run(handler: (topic: string, message: { value: unknown }) => void | Promise<void>) {
    await this.consumer.run({
      eachMessage: async ({ topic, message }) => {
        if (!message.value) return

        handler(topic, { value: JSON.parse(message.value.toString()) })
      },
    })
  }
}
