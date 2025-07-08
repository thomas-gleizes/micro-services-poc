import { Module } from '@nestjs/common'
import { CqrsModule } from '@nestjs/cqrs'
import { ProductModule } from './shared/modules/product.module'
import { KafkaModule } from './shared/kafka/kafka.module'

@Module({
  imports: [CqrsModule.forRoot(), KafkaModule, ProductModule],
})
export class AppModule {}
