import * as joi from 'joi'

export const envSchema = joi.object({
  PORT: joi.number().required(),
  DATABASE_URL: joi.string().uri().required(),
  KAFKA_BROKER: joi.string().required(),
  KAFKA_CONSUMER_GROUP: joi.string().required(),
  KAFKA_CONSUMER_RETRIES: joi.number().default(10),
  KAFKA_CONSUMER_INITIAL_RETRY_TIME: joi.number().default(200),
})
