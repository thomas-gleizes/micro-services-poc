import { Injectable, OnModuleInit } from '@nestjs/common'
import { PrismaService } from '../../../services/prisma.service'
import { KafkaService } from '../../../kafka/kafka.service'
import { ProductCreatedEvent } from './product-created.event'

@Injectable()
export class ProductCreatedConsumer implements OnModuleInit {
  constructor(
    private readonly kafkaService: KafkaService,
    private readonly prisma: PrismaService,
  ) {}

  async onModuleInit() {
    await this.kafkaService.subscribe(ProductCreatedEvent.EVENT_NAME)
    await this.kafkaService.runEachMessage((message: any) => {
      console.log(message)
    })
  }
}
