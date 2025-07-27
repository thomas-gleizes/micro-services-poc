import { IEvent, IMessageSource } from '@nestjs/cqrs'
import { Subject } from 'rxjs'
import { Inject, Injectable, OnModuleInit } from '@nestjs/common'
import { KafkaConsumer } from '../kafka/kafka.consumer'
import { Message, Serializable } from './message.interface'
import { DiscoveryService } from '@nestjs/core'
import { EVENTS_HANDLER_METADATA } from '@nestjs/cqrs/dist/utils/constants'

@Injectable()
export class MessagingSubscriber implements IMessageSource, OnModuleInit {
  private bridge: Subject<any>
  private readonly events = []

  constructor(
    private readonly consumer: KafkaConsumer,
    private readonly discoveryService: DiscoveryService,
  ) {}

  async onModuleInit() {
    const providers = this.discoveryService.getProviders()

    for (const wrapper of providers) {
      if (!wrapper.metatype) continue

      const event = Reflect.getMetadata(EVENTS_HANDLER_METADATA, wrapper.metatype)

      if (!event) {
        console.log(wrapper.instance.name)
      }
    }
  }

  async connect(): Promise<void> {
    await this.consumer.subscribe(
      { topic: /Event$/, fromBeginning: true },
      async ({ topic, message }) => {
        for (const event of this.events) {
          // @ts-ignore
          this.bridge.next(event.deserialize(message as Serializable))
        }
      },
    )
  }

  bridgeEventsTo<T extends IEvent>(subject: Subject<T>): any {
    this.bridge = subject
  }
}
