import { EventData } from '../../events-store/event-store.interface'
import { IEvent } from '@nestjs/cqrs'
import { Injectable, SetMetadata } from '@nestjs/common'

// Constante pour le metadata
export const PROJECTION_HANDLER_METADATA = 'PROJECTION_HANDLER_METADATA'

// Décorateur Projection qui accepte une classe d'événement
export function Projection<T extends IEvent>(eventClass: new (...args: any[]) => T) {
  return (target: any) => {
    // Ajoute le décorateur Injectable pour que la classe soit injectable
    Injectable()(target)

    // Stocke la classe d'événement dans les métadonnées
    SetMetadata(PROJECTION_HANDLER_METADATA, eventClass)(target)

    return target
  }
}

export interface IProjectionHandler<Data extends IEvent> {
  handle(event: EventData<Data>): Promise<void>
}
