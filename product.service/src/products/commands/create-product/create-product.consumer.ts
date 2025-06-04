import { Injectable, OnModuleInit } from '@nestjs/common'
import { PrismaService } from '../../../services/prisma.service'
import { KafkaService } from '../../../kafka/kafka.service'
import { ProductCreatedEvent } from './product-created.event'
import { Product } from '@prisma/client'

@Injectable()
export class ProductCreatedConsumer implements OnModuleInit {
  constructor(
    private readonly kafkaService: KafkaService,
    private readonly prisma: PrismaService,
  ) {}

  async onModuleInit() {
    await this.kafkaService.subscribe(ProductCreatedEvent.EVENT_NAME)
    await this.kafkaService.runEachMessage(async (event: ProductCreatedEvent) => {
      try {
        console.log('Event', event)
        const result = await this.prisma.product.create({ data: event.product })
        console.log('Result', result)
      } catch (error) {
        console.log(error)
      }
    })
  }
}
