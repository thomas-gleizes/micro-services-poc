import { Injectable, Logger } from '@nestjs/common'
import { OutboxService } from './outbox.service'
import { Interval } from '@nestjs/schedule'

@Injectable()
export class OutboxProcessorService {
  private readonly logger = new Logger('OUTBOX_PROCESSOR')

  constructor(private readonly outbox: OutboxService) {}

  @Interval('outbox_process', 10_000)
  async execute() {
    await this.outbox.processPendingEvents()
  }
}
