import { Inject, Injectable, OnModuleInit } from '@nestjs/common'
import { Producer } from 'kafkajs'

@Injectable()
export class KafkaProducer implements OnModuleInit {
  constructor(@Inject('KAFKA_PRODUCER') private readonly producer: Producer) {}

  onModuleInit() {
    return this.producer.connect()
  }

  async publish<T extends object>(topic: string, payload: T): Promise<void> {
    const metadatas = await this.producer.send({
      topic,
      messages: [{ value: JSON.stringify(payload) }],
    })

    console.log('Metadatas', metadatas)
  }
}
