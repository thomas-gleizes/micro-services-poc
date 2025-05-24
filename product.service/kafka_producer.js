const { Kafka } = require('kafkajs')

async function main() {
  const kafka = new Kafka({
    clientId: 'event_store',
    brokers: ['event_bus:9092'],
  })

  const producer = kafka.producer()

  await producer.connect()
  await producer.send({
    topic: 'test-topic',
    messages: [
      {
        key: 'create',
        headers: { userId: '1' },
        value: JSON.stringify({ number: Math.random(), timestamp: Date.now() }),
      },
      {
        key: 'create',
        headers: { userId: '2' },
        value: JSON.stringify({ number: Math.random(), timestamp: Date.now() }),
      },
    ],
  })
}

void main()
