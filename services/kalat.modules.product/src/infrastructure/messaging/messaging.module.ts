import { Global, Module } from '@nestjs/common'
import { KafkaModule } from '../kafka/kafka.module'
import { ConfigService } from '@nestjs/config'
import { DiscoveryModule } from '@nestjs/core'
import { MessagingProjectionSubscriber } from './event/messaging-projection.subscriber'
import { MessagingPublisher } from './messaging.publisher'
import { MESSAGING_BASE } from './messaging.token'
import { KafkaRunner } from '../kafka/kafka.runner'

@Global()
@Module({
  imports: [KafkaModule, DiscoveryModule],
  providers: [
    MessagingPublisher,
    MessagingProjectionSubscriber,
    {
      provide: MESSAGING_BASE,
      useFactory: (config: ConfigService) =>
        `${config.getOrThrow('SERVICE_NAME')}.${config.getOrThrow('SERVICE_VERSION')}`,
      inject: [ConfigService],
    },
    KafkaRunner,
  ],
  exports: [MessagingPublisher],
})
export class MessagingModule {}
