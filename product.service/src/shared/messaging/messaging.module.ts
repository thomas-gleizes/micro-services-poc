import { Module, OnModuleInit, DynamicModule, Global } from '@nestjs/common'
import { KafkaModule } from '../kafka/kafka.module'
import { QueryBus, CqrsModule } from '@nestjs/cqrs'
import { MessagingQueryBus } from './messaging-query.bus'
import { ConfigModule } from '@nestjs/config'
import { DiscoveryModule } from '@nestjs/core'

@Global()
@Module({
  imports: [KafkaModule, ConfigModule, DiscoveryModule],
  providers: [
    {
      provide: QueryBus,
      useClass: MessagingQueryBus,
    },
  ],
  exports: [QueryBus],
})
export class MessagingModule implements OnModuleInit {
  constructor() {} // private readonly subscriber: MessagingSubscriber, // private readonly eventPublisher: MessagingEventPublisher, // private readonly eventBus: EventBus,

  static forRoot(): DynamicModule {
    return {
      module: MessagingModule,
      imports: [CqrsModule.forRoot()],
    }
  }

  async onModuleInit() {
    // await this.subscriber.connect()
    // this.subscriber.bridgeEventsTo(this.eventBus.subject$)
    // await this.eventPublisher.connect()
    // this.eventBus.publisher = this.eventPublisher
  }
}
