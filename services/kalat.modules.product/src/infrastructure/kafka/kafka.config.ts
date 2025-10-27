import { KafkaOptions, Transport } from '@nestjs/microservices'
import { ConfigService } from '@nestjs/config'
import { logLevel } from 'kafkajs'

/**
 * Kafka configuration options
 */
export interface KafkaConfig {
  /**
   * Broker configuration
   */
  broker: {
    /**
     * List of Kafka brokers
     */
    brokers: string[]
    /**
     * Log level for Kafka client
     */
    logLevel: logLevel
  }
  /**
   * Consumer configuration
   */
  consumer: {
    /**
     * Consumer group ID
     */
    groupId: string
    /**
     * Allow topic creation
     */
    allowAutoTopicCreation?: boolean
    /**
     * Number of retries for consumer
     */
    maxRetries?: number
    /**
     * Initial retry time in ms
     */
    initialRetryTime?: number
    /**
     * Session timeout in ms
     */
    sessionTimeout?: number
    /**
     * Heartbeat interval in ms
     */
    heartbeatInterval?: number
    /**
     * Read messages from beginning of topic
     */
    readUncommitted?: boolean
  }
  /**
   * Producer configuration
   */
  producer: {
    /**
     * Allow topic creation
     */
    allowAutoTopicCreation?: boolean
    /**
     * Transaction timeout in ms
     */
    transactionTimeout?: number
    /**
     * Idempotent producer
     */
    idempotent?: boolean
  }
}

/**
 * Get Kafka configuration from environment variables
 * @param config ConfigService instance
 * @returns Kafka configuration
 */
export function getKafkaConfig(config: ConfigService): KafkaConfig {
  return {
    broker: {
      brokers: config.getOrThrow<string>('KAFKA_BROKERS').split(','),
      logLevel: logLevel.WARN,
    },
    consumer: {
      groupId: config.getOrThrow<string>('KAFKA_CONSUMER_GROUP'),
      allowAutoTopicCreation: true,
      maxRetries: config.get<number>('KAFKA_CONSUMER_RETRIES', 10),
      initialRetryTime: config.get<number>('KAFKA_CONSUMER_INITIAL_RETRY_TIME', 200),
      sessionTimeout: config.get<number>('KAFKA_CONSUMER_SESSION_TIMEOUT', 30000),
      heartbeatInterval: config.get<number>('KAFKA_CONSUMER_HEARTBEAT_INTERVAL', 3000),
      readUncommitted: false,
    },
    producer: {
      allowAutoTopicCreation: true,
      transactionTimeout: config.get<number>('KAFKA_PRODUCER_TRANSACTION_TIMEOUT', 30000),
      idempotent: true,
    },
  }
}

/**
 * Get Kafka microservice options for NestJS
 * @param config ConfigService instance
 * @returns Kafka microservice options
 */
export function getKafkaMicroserviceOptions(config: ConfigService): KafkaOptions {
  const kafkaConfig = getKafkaConfig(config)

  return {
    transport: Transport.KAFKA,
    options: {
      client: {
        brokers: kafkaConfig.broker.brokers,
        logLevel: kafkaConfig.broker.logLevel,
      },
      consumer: {
        groupId: kafkaConfig.consumer.groupId,
        allowAutoTopicCreation: kafkaConfig.consumer.allowAutoTopicCreation,
        retry: {
          retries: kafkaConfig.consumer.maxRetries,
          initialRetryTime: kafkaConfig.consumer.initialRetryTime,
        },
        sessionTimeout: kafkaConfig.consumer.sessionTimeout,
        heartbeatInterval: kafkaConfig.consumer.heartbeatInterval,
        readUncommitted: kafkaConfig.consumer.readUncommitted,
      },
      producer: {
        allowAutoTopicCreation: kafkaConfig.producer.allowAutoTopicCreation,
        transactionTimeout: kafkaConfig.producer.transactionTimeout,
        idempotent: kafkaConfig.producer.idempotent,
      },
    },
  }
}
