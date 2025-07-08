import { IEvent } from '@nestjs/cqrs'

export class ProductDeleteEvent implements IEvent {
  constructor(public readonly productId: string) {}
}
