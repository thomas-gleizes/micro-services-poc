import { ICommand } from '@nestjs/cqrs'
import { Message } from '../../../shared/messaging/message.interface'

export class DeleteProductCommand extends Message implements ICommand {
  constructor(public readonly productId: string) {
    super()
  }
}

export class DeleteProductCommandReply extends Message {
  constructor() {
    super()
  }
}
