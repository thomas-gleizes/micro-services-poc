import { CommandBus } from '@nestjs/cqrs'
import { Injectable, Logger } from '@nestjs/common'
import { ModuleRef } from '@nestjs/core'
import { KafkaCommandPublisher } from './kafka-command.publisher'

@Injectable()
export class KafkaCommandBus extends CommandBus {
  private readonly _logger = new Logger(KafkaCommandBus.name)

  constructor(kafkaCommandPublisher: KafkaCommandPublisher, moduleRef: ModuleRef) {
    console.log('INVOKE COMMAND BUS')
    super(moduleRef, { commandPublisher: kafkaCommandPublisher })
  }
}
