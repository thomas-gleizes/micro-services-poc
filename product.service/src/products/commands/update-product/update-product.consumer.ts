import { Injectable, OnModuleInit } from '@nestjs/common'
import { PrismaService } from '../../../services/prisma.service'
import { ProductUpdateEvent } from './product-updated.event'
import { KafkaConsumer } from '../../../kafka/kafka.consumer'

@Injectable()
export class UpdateProductConsumer implements OnModuleInit {
  constructor(
    private readonly kafkaConsumer: KafkaConsumer,
    private readonly prisma: PrismaService,
  ) {}

  async onModuleInit(): Promise<void> {
    // await this.kafkaConsumer.consume(ProductUpdateEvent.EVENT_NAME, async (event: ProductUpdateEvent) => {
    //   const result = await this.prisma.product.update({
    //     where: { id: event.id },
    //     data: event.product,
    //   })
    //
    //   console.log('Result', result)
    // })
  }
}
