import { CommandHandler, ICommandHandler } from '@nestjs/cqrs'
import { CreateProductCommand } from './create-product.command'
import { ProductCreatedEvent } from './product-created.event'
import { KafkaService } from '../../../kafka/kafka.service'
import * as crypto from 'node:crypto'

@CommandHandler(CreateProductCommand)
export class CreateProductHandler implements ICommandHandler<CreateProductCommand> {
  constructor(private readonly kafkaService: KafkaService) {}

  async execute(command: CreateProductCommand): Promise<void> {
    const event = new ProductCreatedEvent({
      id: crypto.randomUUID(),
      name: command.name,
      price: command.price,
    })

    await this.kafkaService.emit(ProductCreatedEvent.EVENT_NAME, event)
  }
}
