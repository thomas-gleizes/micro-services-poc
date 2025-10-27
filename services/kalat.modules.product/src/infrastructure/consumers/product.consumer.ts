import { Controller } from '@nestjs/common'
import { MessagePattern, Payload } from '@nestjs/microservices'
import { PRODUCT_TOPIC } from '../messaging/messaging.constants'

@Controller()
export class ProductConsumer {
  @MessagePattern(PRODUCT_TOPIC)
  handleEvent(@Payload() message: any) {
    console.log('Event Handler', message)
  }
}
