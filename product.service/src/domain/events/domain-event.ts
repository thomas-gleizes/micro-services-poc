import { IEvent } from '@nestjs/cqrs'

export interface SerializedEvent {}

export interface DomainEventClass<T = any> {
  name: string
  deserialize(data: any): T
}

export abstract class DomainEvent<T extends SerializedEvent, E extends DomainEvent<T, E>> implements IEvent {
  public serialize(): T {
    return { ...this } as unknown as T
  }
}
