import { AggregateRoot as NestAggregateRoot, IEvent } from '@nestjs/cqrs'

export abstract class AggregateRoot extends NestAggregateRoot {
  private _version: number = 0
  private _events: IEvent[] = []

  get version(): number {
    return this._version
  }

  protected increment() {
    this._version += 1
  }

  public apply(event: IEvent) {
    this._events.push(event)
  }

  public markEventsAsCommitted() {
    this._events = []
  }

  public getUncommittedEvents(): IEvent[] {
    return this._events
  }
}
