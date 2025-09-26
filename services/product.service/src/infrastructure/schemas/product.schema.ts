import { Column, Entity, ObjectIdColumn, PrimaryColumn } from 'typeorm'
import { ObjectId } from 'mongodb'

@Entity()
export class ProductSchema {
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

  @Column({ type: 'string' })
  status: string

  @Column({ type: 'datetime' })
  createdAt: Date

  @Column({ type: 'datetime' })
  updatedAt: Date

  @Column({ type: 'string' })
  state: string

  @Column({ type: 'string' })
  version: number
}
