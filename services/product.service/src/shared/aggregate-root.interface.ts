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

  protected abstract getAggregateId(): string

  protected abstract getAggregateType(): string

  public apply(event: IEvent) {
    this.increment()
    this._events.push(event)

    super.apply({
      aggregateId: this.getAggregateId(),
      aggregateType: this.getAggregateType(),
      version: this._version,
      payload: event,
      timestamp: Date.now(),
    })
  }

  public commit() {
    super.commit()
    this._events = []
  }
}
