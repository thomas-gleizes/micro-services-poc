import { Column, Entity, ObjectIdColumn } from 'typeorm'
import { ObjectId } from 'mongodb'

@Entity({ name: 'events' })
export class EventSchema {
  @ObjectIdColumn()
  _id: ObjectId

  @Column({ type: 'string' })
  id: string

  @Column({ type: 'string' })
  type: string

  @Column({ type: 'string' })
  aggregateId: string

  @Column({ type: 'string' })
  aggregateType: string

  @Column({ type: 'simple-json' })
  data: any

  @Column({ type: 'simple-json', nullable: true })
  metadata: any

  @Column({ type: 'smallint' })
  version: number

  @Column({ type: 'datetime' })
  timestamp: Date
}
