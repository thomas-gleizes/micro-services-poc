import { AggregateRoot as NestAggregateRoot, IEvent } from '@nestjs/cqrs'

export abstract class AggregateRoot extends NestAggregateRoot {
  private _version: number = 0

  get version(): number {
    return this._version
  }

  public increment() {
    this._version += 1
  }

  set version(version: number) {
    this._version = version
  }

  public abstract getAggregateId(): string

  public abstract getAggregateType(): string

  public apply(event: IEvent) {
    super.apply(event)
  }

  public commit() {
    super.commit()
  }
}
