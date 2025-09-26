import { ICommand } from '@nestjs/cqrs'

export class ArchiveProductCommand implements ICommand {
  public constructor(public readonly productId: string) {}
}
