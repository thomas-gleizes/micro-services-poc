import { Column, Entity, ObjectIdColumn } from 'typeorm'
import { ObjectId } from 'mongodb'

@Entity({ name: 'readable_products' })
export class ReadableProductSchema {
  @ObjectIdColumn()
  _id: ObjectId

  @Column({ type: 'string' })
  id: string

  @Column({ type: 'string' })
  name: string

  @Column({ type: 'string' })
  description: string

  @Column({ type: 'float' })
  price: number

  @Column({ type: 'string' })
  currency: string

  @Column({ type: 'boolean' })
  isAvailable: boolean

  @Column({ type: 'datetime' })
  createdAt: Date

  @Column({ type: 'datetime' })
  updatedAt: Date

  @Column({ type: 'number', default: 1, name: '_version' })
  _version: number
}
