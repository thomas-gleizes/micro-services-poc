import { NestFactory } from '@nestjs/core'
import { SeederModule } from './seeder.module'
import { ProductAggregate } from '../../domain/aggregates/product.aggregate'
import { ProductId } from '../../domain/value-object/product-id.vo'
import { randomUUID } from 'node:crypto'
import { ProductCommandRepository } from '../persistance/repositories/product-command.repository'
import { faker } from '@faker-js/faker/locale/fr'
import { Logger } from '@nestjs/common'
import { ag } from '@faker-js/faker/dist/airline-DF6RqYmq'

async function seedProducts() {
  const app = await NestFactory.createApplicationContext(SeederModule, { logger: ['verbose'] })
  const logger = new Logger('SEEDER')

  logger.log('START SEEDING ...')

  const repository = app.get(ProductCommandRepository)

  for (let i = 0; i < 200; i++) {
    const aggregate = ProductAggregate.create(
      new ProductId(randomUUID()),
      faker.commerce.productName(),
      faker.commerce.productDescription(),
      +faker.commerce.price({ min: 0.5, max: 9999.99 }),
      Math.random() > 0.2 ? 'EUR' : 'USD',
    )

    aggregate.enable()

    if (Math.random() > 0.5) {
      aggregate.disable()
      aggregate.update(
        'product a' + i,
        aggregate.description,
        aggregate.price * 1.2,
        aggregate.currency,
      )
      aggregate.enable()
    }

    if (Math.random() > 0.5) {
      aggregate.disable()
      aggregate.archive()
    }

    logger.log(`SEED ${aggregate.getAggregateId()} - ${aggregate.getUncommittedEvents().length}`)
    await repository.save(aggregate)
  }

  logger.log('SEEDING DONE')
  await app.close()
}

void seedProducts()
