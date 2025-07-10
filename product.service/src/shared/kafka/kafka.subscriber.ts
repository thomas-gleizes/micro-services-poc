import { IEvent, IMessageSource } from '@nestjs/cqrs'
import { Subject } from 'rxjs'
import { Consumer, Kafka, logLevel } from 'kafkajs'
import { Inject } from '@nestjs/common'

export class KafkaSubscriber implements IMessageSource {
  private bridge: Subject<any>
  private readonly events: Array<any>
  private consumer: Consumer

  constructor(@Inject('EVENTS') events: Array<any>) {
    this.events = events
    this.consumer = new Kafka({
      clientId: 'product_service_consumer',
      brokers: ['event_bus:9092'],
      logLevel: logLevel.ERROR,
    }).consumer({ groupId: 'cqrs-group' })
  }

  async connect(): Promise<void> {
    await this.consumer.connect()

    for (const event of this.events) {
      await this.consumer.subscribe({ topic: event.name, fromBeginning: false })
    }

    await this.consumer.run({
      eachMessage: async ({ topic, partition, message }) => {
        if (this.bridge) {
          for (const event of this.events) {
            if (event.name === topic) {
              // @ts-ignore
              const parsedJson = JSON.parse(message.value.toString())
              console.log('ParsedJson', parsedJson)

              // Use the deserialize method of the event class to create the event instance
              const receivedEvent = event.deserialize(parsedJson)

              // Log the received event and its serialized form
              console.log('ReceivedEvent', receivedEvent)
              console.log('Serialized Event', receivedEvent.serialize())

              this.bridge.next(receivedEvent)
            }
          }
        }
      },
    })
  }

  bridgeEventsTo<T extends IEvent>(subject: Subject<T>): any {
    this.bridge = subject
  }
}
