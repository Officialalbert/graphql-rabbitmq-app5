const amqplib = require('amqplib');

const RABBITMQ_URL = process.env.RABBITMQ_URL || 'amqp://localhost';
const QUEUE_NAME = 'book_created';

let channel = null;

async function connectRabbitMQ() {
  const connection = await amqplib.connect(RABBITMQ_URL);
  channel = await connection.createChannel();
  // durable: true — очередь переживёт перезапуск RabbitMQ
  await channel.assertQueue(QUEUE_NAME, { durable: true });
  console.log(`[RabbitMQ] Подключено. Очередь "${QUEUE_NAME}" готова`);
  return channel;
}

async function publishBookCreated(book) {
  if (!channel) {
    console.warn('[RabbitMQ] Нет подключения — сообщение не отправлено');
    return;
  }
  const payload = JSON.stringify({
    event: 'book.created',
    book,
    createdAt: new Date().toISOString(),
  });
  channel.sendToQueue(QUEUE_NAME, Buffer.from(payload), {
    persistent: true, // сообщение переживёт перезапуск RabbitMQ
  });
  console.log(`[RabbitMQ] Отправлено в "${QUEUE_NAME}":`, payload);
}

module.exports = { connectRabbitMQ, publishBookCreated, QUEUE_NAME };