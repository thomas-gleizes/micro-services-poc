import { IQuery } from '@nestjs/cqrs'

export class ReadProductQuery implements IQuery {
  constructor(public readonly productId: string) {}
}
