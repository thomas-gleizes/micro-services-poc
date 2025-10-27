import { Global, Module } from '@nestjs/common'
import { EVENT_STORE } from './event-store.interface'
import { EventStore } from './events-store'
import { OutboxService } from './outbox/outbox.service'
import { OutboxProcessorService } from './outbox/outbox-processor.service'
import { CqrsModule } from '@nestjs/cqrs'

@Global()
@Module({
  imports: [CqrsModule],
  providers: [
    { provide: EVENT_STORE, useClass: EventStore },
    OutboxService,
    OutboxProcessorService,
  ],
  exports: [EVENT_STORE],
})
export class EventStoreModule {}
