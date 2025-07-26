const { Kafka } = require('kafkajs')

async function main() {
  const kafka = new Kafka({
    clientId: 'event_store',
    brokers: ['event_bus:9092'],
  })

  const groupId = Math.floor(Math.random() * 1000000).toString()

  console.log('GroupId', groupId)

  const consumer = kafka.consumer({ groupId: groupId })

  await consumer.subscribe({ topic: 'test-topic', fromBeginning: true })
  await consumer.run({
    eachMessage: async ({ topic, partition, message }) => {
      console.log('TOPIC', topic, partition)
      console.log({ value: message.value.toString() })
    },
  })
}

void main()
