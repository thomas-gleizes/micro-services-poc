import { IEvent } from '@nestjs/cqrs';

/**
 * Base event class that all event classes should extend.
 * Provides a consistent interface for serialization and deserialization.
 */
export abstract class BaseEvent implements IEvent {
  /**
   * Deserializes the event data from a JSON string or object.
   * This method should be implemented by each event class to handle its specific data structure.
   * @param data The serialized event data
   */
  static deserialize(data: any): BaseEvent {
    throw new Error('Method not implemented. Each event class must implement this method.');
  }

  /**
   * Serializes the event to a JSON-compatible object.
   * This method should be implemented by each event class to handle its specific data structure.
   */
  serialize(): any {
    throw new Error('Method not implemented. Each event class must implement this method.');
  }
}
