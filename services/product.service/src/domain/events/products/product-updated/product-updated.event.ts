import { IEvent } from '@nestjs/cqrs'

export class ProductUpdatedEvent implements IEvent {
  constructor(
    public readonly name: string,
    public readonly description: string,
    public readonly price: number,
    public readonly currency: string,
    public readonly updatedAt: Date,
  ) {}
}
