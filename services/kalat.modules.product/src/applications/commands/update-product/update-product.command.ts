import { ICommand } from '@nestjs/cqrs'

export class UpdateProductCommand implements ICommand {
  constructor(
    public productId: string,
    public name: string,
    public description: string,
    public price: number,
    public currency: string,
  ) {}
}
