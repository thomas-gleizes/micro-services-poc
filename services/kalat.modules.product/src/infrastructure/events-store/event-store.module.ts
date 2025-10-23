import { Global, Module } from '@nestjs/common'
import { EVENT_STORE } from './event-store.interface'
import { EventStore } from './events-store'
import { TypeOrmModule } from '@nestjs/typeorm'
import { EventSchema } from '../persistance/schemas/event.schema'

@Global()
@Module({
  imports: [TypeOrmModule.forFeature([EventSchema])],
  providers: [
    {
      provide: EVENT_STORE,
      useClass: EventStore,
    },
  ],
  exports: [EVENT_STORE],
})
export class EventStoreModule {}
