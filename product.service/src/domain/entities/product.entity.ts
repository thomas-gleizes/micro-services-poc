import { randomUUID } from 'node:crypto'
import { ProductStatus } from '../enums/product-status.enum'
import { ClassProps } from '../../../types/utils'

export type ProductProps = ClassProps<Product>

export class Product {
  public readonly id: string
  public name: string
  public description: string
  public price: number
  public currency: string
  public image: string
  public readonly status: ProductStatus
  public readonly createdAt: Date
  public updatedAt: Date

  constructor(props: ProductProps) {
    this.id = props.id
    this.name = props.name
    this.description = props.description
    this.price = props.price
    this.currency = props.currency
    this.image = props.image
    this.status = ProductStatus[props.status]
    this.createdAt = props.createdAt
    this.updatedAt = props.updatedAt
  }

  static create(primitives: Omit<ProductProps, 'id' | 'createdAt' | 'updatedAt'>) {
    return new Product({
      ...primitives,
      id: randomUUID(),
      createdAt: new Date(),
      updatedAt: new Date(),
    })
  }

  toPrimitives(): ProductProps {
    return {
      ...this,
    }
  }
}
