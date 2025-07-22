import { Message } from 'src/shared/messaging/message.interface'
import { IQuery } from '@nestjs/cqrs'
import { ProductProps } from '../../../domain/entities/product.entity'

export class ReadProductsQuery extends Message implements IQuery {
  constructor(
    public readonly page?: number,
    public readonly limit?: number,
  ) {
    super()
  }

  static deserialize(): ReadProductsQuery {
    return new ReadProductsQuery()
  }
}

type DataRely = {
  products: ProductProps
}

export class ReadProductsQueryReply extends Message<DataRely> {
  constructor(public readonly products: ProductProps) {
    super()
  }

  static deserialize(data: DataRely): ReadProductsQueryReply {
    return new ReadProductsQueryReply(data.products)
  }
}
