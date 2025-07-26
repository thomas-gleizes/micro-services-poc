import { ICommand } from '@nestjs/cqrs'

export class DeleteProductCommand implements ICommand {
  constructor(public readonly productId: string) {}
}

export class DeleteProductCommandReply implements ICommand {
  constructor() {}
}
