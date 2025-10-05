import { Module } from '@nestjs/common'
import { KafkaModule } from './kafka/kafka.module'
import { CqrsModule } from '@nestjs/cqrs'
import { ConfigModule } from '@nestjs/config'
import { DiscoveryModule } from '@nestjs/core'
import { MessagingEventSubscriber } from './event/messaging.event.subscriber'
import { MessagingEventPublisher } from './event/messaging-event.publisher'

@Module({
  imports: [KafkaModule, ConfigModule, DiscoveryModule, CqrsModule],
  providers: [MessagingEventPublisher, MessagingEventSubscriber],
  exports: [MessagingEventPublisher],
})
export class MessagingModule {}
