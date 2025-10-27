import { Module } from '@nestjs/common'
import { PrismaModule } from '../../shared/prisma/prisma.module'
import { MessagingModule } from '../messaging/messaging.module'
import { KafkaModule } from '../kafka/kafka.module'
import { ProductCommandRepository } from '../persistance/repositories/product-command.repository'
import { ConfigModule } from '@nestjs/config'
import { envSchema } from '../config/environement/env'
import { EVENT_STORE } from '../events-store/event-store.interface'
import { EventStore } from '../events-store/events-store'
import { OutboxService } from '../events-store/outbox/outbox.service'
import { CqrsModule } from '@nestjs/cqrs'

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true, validationSchema: envSchema }),
    CqrsModule,
    PrismaModule,
    MessagingModule,
    KafkaModule,
  ],
  providers: [
    ProductCommandRepository,
    OutboxService,
    {
      provide: EVENT_STORE,
      useClass: EventStore,
    },
  ],
})
export class SeederModule {}
