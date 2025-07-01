import { Injectable, OnModuleInit } from '@nestjs/common'
import { PrismaService } from '../../../services/prisma.service'
import { ProductCreatedEvent } from './product-created.event'
import { KafkaConsumer } from '../../../kafka/kafka.consumer'

@Injectable()
export class ProductCreatedConsumer implements OnModuleInit {
  constructor(
    private readonly kafkaConsumer: KafkaConsumer,
    private readonly prisma: PrismaService,
  ) {}

  async onModuleInit() {
    // await this.kafkaConsumer.consume(ProductCreatedEvent.EVENT_NAME, async (event: ProductCreatedEvent) => {
    //   try {
    //     console.log('Event', event)
    //     const result = await this.prisma.product.create({ data: event.product })
    //     console.log('Result', result)
    //   } catch (error) {
    //     console.log(error)
    //   }
    // })
  }
}
