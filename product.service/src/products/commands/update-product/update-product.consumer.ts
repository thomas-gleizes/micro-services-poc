import { Injectable, OnModuleInit } from '@nestjs/common'
import { KafkaService } from '../../../kafka/kafka.service'
import { PrismaService } from '../../../services/prisma.service'
import { ProductUpdateEvent } from './product-updated.event'

@Injectable()
export class UpdateProductConsumer implements OnModuleInit {
  constructor(
    private readonly kafkaService: KafkaService,
    private readonly prisma: PrismaService,
  ) {}

  async onModuleInit(): Promise<void> {
    await this.kafkaService.consume(ProductUpdateEvent.EVENT_NAME, async (event: ProductUpdateEvent) => {
      const result = await this.prisma.product.update({
        where: { id: event.id },
        data: event.product,
      })

      console.log('Result', result)
    })
  }
}
