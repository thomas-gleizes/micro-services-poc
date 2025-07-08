import { Inject, Injectable, Logger, OnModuleInit } from '@nestjs/common'
import { Consumer } from 'kafkajs'

type MessageHandler<P extends object> = (payload: P) => void | Promise<void>

type Topic = string | RegExp

@Injectable()
export class KafkaConsumer implements OnModuleInit {
  private readonly handlers: Map<Topic, MessageHandler<any>> = new Map()
  private readonly logger = new Logger(KafkaConsumer.name)

  constructor(@Inject('KAFKA_CONSUMER') private readonly consumer: Consumer) {}

  onModuleInit() {
    return this.consumer.connect()
  }

  public async consume<P extends object>(topic: Topic, handler: MessageHandler<P>) {
    if (this.handlers.has(topic)) {
      this.logger.warn(`Handler for topic ${topic} already exists`)
      return
    }

    this.handlers.set(topic, handler)

    await this.consumer.stop()
    await this.consumer.subscribe({ topic: topic.toString(), fromBeginning: true })

    await this.consumer.run({
      eachMessage: async ({ topic: receivedTopic, message }) => {
        try {
          // Trouve le handler correspondant au topic
          const matchingHandler = Array.from(this.handlers.entries()).find(([pattern]) =>
            typeof pattern === 'string' ? pattern === receivedTopic : pattern.test(receivedTopic),
          )?.[1]

          if (!matchingHandler) {
            this.logger.warn(`No handler found for topic ${receivedTopic}`)
            return
          }

          // Parse le message et exécute le handler
          const payload = JSON.parse(message.value?.toString() || '{}')
          this.logger.debug(`Processing message from topic ${receivedTopic}`)

          await matchingHandler(payload)

          this.logger.debug(`Successfully processed message from topic ${receivedTopic}`)
        } catch (error) {
          this.logger.error(
            `Error processing message from topic ${receivedTopic}: ${error.message}`,
            error.stack,
          )
        }
      },
    })

    this.logger.log(`Successfully subscribed to topic ${topic}`)
  }
}
