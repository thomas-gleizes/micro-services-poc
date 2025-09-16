import { Column, Entity } from 'typeorm'

@Entity()
export class ProductSchema {
  @Column()
  id: string

  @Column()
  name: string

  @Column()
  description: string

  @Column()
  price: number

  @Column()
  currency: string

  @Column()
  image: string

  @Column()
  status: string

  @Column()
  createdAt: Date

  @Column()
  updatedAt: Date

  @Column()
  state: string

  @Column()
  version: string
}
