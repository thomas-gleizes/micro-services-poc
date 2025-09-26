import { IEvent } from '@nestjs/cqrs'

export class ProductArchivedEvent implements IEvent {
  constructor() {}
}
