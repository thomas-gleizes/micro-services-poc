import { CommandHandler, ICommandHandler } from '@nestjs/cqrs'
import { UpdateProductCommand } from './update-product.command'
import { ProductUpdateEvent } from './product-updated.event'
import { KafkaService } from '../../../kafka/kafka.service'

@CommandHandler(UpdateProductCommand)
export class UpdateProductHandler implements ICommandHandler<UpdateProductCommand> {
  constructor(private readonly kafkaService: KafkaService) {}

  async execute(command: UpdateProductCommand) {
    const event = new ProductUpdateEvent(command.id, {
      name: command.name,
      price: command.price,
    })

    await this.kafkaService.publish(ProductUpdateEvent.EVENT_NAME, event)
  }
}
