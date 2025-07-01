import { Injectable, Logger } from '@nestjs/common'
import { ICommand, ICommandPublisher } from '@nestjs/cqrs'
import { KafkaProducer } from './kafka.producer'

@Injectable()
export class KafkaCommandPublisher implements ICommandPublisher {
  private readonly logger = new Logger(KafkaCommandPublisher.name)

  constructor(private readonly kafkaProducer: KafkaProducer) {}

  publish<T extends ICommand = ICommand>(command: T) {
    this.logger.debug('publish command : ' + command.constructor.name.toString())
    return this.kafkaProducer.publish(command.constructor.name, command)
  }
}
