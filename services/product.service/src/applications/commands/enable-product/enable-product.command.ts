import { ICommand } from '@nestjs/cqrs'

export class EnableProductCommand implements ICommand {
  constructor(public readonly productId: string) {}
}
