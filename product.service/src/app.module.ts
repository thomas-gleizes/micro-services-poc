import { Module } from '@nestjs/common'
import { CqrsModule } from '@nestjs/cqrs'
import { ProductModule } from './products/product.module'
import { KafkaModule } from './kafka/kafka.module'

@Module({
  imports: [CqrsModule.forRoot(), KafkaModule, ProductModule],
})
export class AppModule {}
