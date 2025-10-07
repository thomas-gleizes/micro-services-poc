import { ICommand } from '@nestjs/cqrs'

export class DisableProductCommand implements ICommand {
  constructor(public readonly productId: string) {}
}
