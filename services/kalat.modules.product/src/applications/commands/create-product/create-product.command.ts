import { ICommand } from '@nestjs/cqrs'

export class CreateProductCommand implements ICommand {
  constructor(
    public name: string,
    public description: string,
    public price: number,
    public currency: string,
  ) {}
}
