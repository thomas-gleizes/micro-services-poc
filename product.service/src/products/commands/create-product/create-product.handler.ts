import * as crypto from 'node:crypto'
import { Product } from '@prisma/client'
import { CommandHandler, ICommandHandler } from '@nestjs/cqrs'
import { CreateProductCommand } from './create-product.command'
import { ProductCreatedEvent } from './product-created.event'
import { KafkaProducer } from '../../../kafka/kafka.producer'

@CommandHandler(CreateProductCommand)
export class CreateProductHandler implements ICommandHandler<CreateProductCommand> {
  constructor(private readonly kafkaProducer: KafkaProducer) {}

  async execute(command: CreateProductCommand): Promise<Product> {
    const event = new ProductCreatedEvent({
      id: crypto.randomUUID(),
      name: command.name,
      price: command.price,
    })

    await this.kafkaProducer.publish(ProductCreatedEvent.EVENT_NAME, event)

    return event.product
  }
}
