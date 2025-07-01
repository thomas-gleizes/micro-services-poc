import { CommandHandler, ICommandHandler } from '@nestjs/cqrs'
import { UpdateProductCommand } from './update-product.command'
import { ProductUpdateEvent } from './product-updated.event'
import { KafkaProducer } from '../../../kafka/kafka.producer'

@CommandHandler(UpdateProductCommand)
export class UpdateProductHandler implements ICommandHandler<UpdateProductCommand> {
  constructor(private readonly kafkaProducer: KafkaProducer) {}

  async execute(command: UpdateProductCommand) {
    const event = new ProductUpdateEvent(command.id, {
      name: command.name,
      price: command.price,
    })

    await this.kafkaProducer.publish(ProductUpdateEvent.EVENT_NAME, event)
  }
}
