export type Serializable = {
  [key: string]: Date | string | number | boolean | null | undefined | Serializable[] | Serializable
}

export abstract class Message<T extends Serializable = {}> {
  public serialize(): T {
    return { ...this } as unknown as T
  }

  static deserialize(data: Serializable): Message {
    throw new Error('deserialize must be implemented in derived class')
  }
}
