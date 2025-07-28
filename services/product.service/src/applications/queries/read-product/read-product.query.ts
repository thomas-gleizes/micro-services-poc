import { IQuery } from '@nestjs/cqrs'
import { Message } from '../../../shared/messaging/message.interface'

export class ReadProductQuery extends Message implements IQuery {
  constructor(public readonly productId: string) {
    super()
  }
}

export class ReadProductQueryReply extends Message {
  constructor() {
    super()
  }
}
