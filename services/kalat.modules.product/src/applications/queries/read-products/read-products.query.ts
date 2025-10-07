import { IQuery } from '@nestjs/cqrs'

export class ReadProductsQuery implements IQuery {
  constructor(
    public readonly page?: number,
    public readonly limit?: number,
  ) {}
}
