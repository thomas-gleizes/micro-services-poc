import * as joi from 'joi'

export const envSchema = joi.object({
  NODE_ENV: joi.string().default('development'),
  PORT: joi.number().default(3000),
  DATABASE_URL: joi.string().uri().required(),
  KAFKA_BROKERS: joi
    .string()
    .pattern(/^([a-zA-Z0-9._-]+:\d+)(,[a-zA-Z0-9._-]+:\d+)*$/)
    .required(),
  KAFKA_CONSUMER_GROUP: joi.string().required(),
  KAFKA_CONSUMER_RETRIES: joi.number().default(10),
  KAFKA_CONSUMER_INITIAL_RETRY_TIME: joi.number().default(200),

  SERVICE_NAME: joi.string().required(),
  SERVICE_VERSION: joi.string().required(),

  LOG_LEVEL: joi.string().valid('fatal', 'error', 'warn', 'log', 'verbose', 'debug').required(),
})
