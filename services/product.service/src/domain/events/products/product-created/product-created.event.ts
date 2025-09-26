import { IEvent } from '@nestjs/cqrs'

export class ProductCreatedEvent implements IEvent {
  constructor(
    public readonly productId: string,
    public readonly name: string,
    public readonly description: string,
    public readonly price: number,
    public readonly currency: string,
    public readonly status: string,
    public readonly createdAt: Date,
    public readonly updatedAt: Date,
  ) {}
}
