export type MessagePayload = {
  [key: string]: string | number | boolean | MessagePayload | MessagePayload[]
}

export type MessageMetadata = { [key: string]: string }

export interface Message<Payload extends MessagePayload, Metadata extends MessageMetadata> {
  id: string
  content_type: string
  payload: Payload
  metadata: Metadata
  created_by: string
  created_at: string
}

export interface DomainEvent<Payload extends MessagePayload> extends Message<Payload, {}> {
  version: number
  state: string
  aggregate_id: string
}
