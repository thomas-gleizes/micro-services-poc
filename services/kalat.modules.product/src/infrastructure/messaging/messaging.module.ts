import { Global, Module } from '@nestjs/common'
import { KafkaModule } from '../kafka/kafka.module'
import { DiscoveryModule } from '@nestjs/core'
import { MessagingPublisher } from './messaging.publisher'

@Global()
@Module({
  imports: [KafkaModule, DiscoveryModule],
  providers: [MessagingPublisher],
  exports: [MessagingPublisher],
})
export class MessagingModule {}
