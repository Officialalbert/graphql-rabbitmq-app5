const amqplib = require('amqplib');

const RABBITMQ_URL = process.env.RABBITMQ_URL || 'amqp://localhost';
const QUEUE_NAME = 'book_created';

async function startConsumer() {
  const connection = await amqplib.connect(RABBITMQ_URL);
  const channel = await connection.createChannel();

  await channel.assertQueue(QUEUE_NAME, { durable: true });

  // По одному сообщению за раз — чтобы обработка была последовательной
  channel.prefetch(1);

  console.log(`[Consumer] Ожидание сообщений в "${QUEUE_NAME}"...`);

  channel.consume(QUEUE_NAME, async (msg) => {
    if (!msg) return;

    try {
      const data = JSON.parse(msg.content.toString());
      console.log('[Consumer] Получено сообщение:', data);

      // Имитация обработки: например, отправка письма, генерация отчёта и т.п.
      await new Promise((r) => setTimeout(r, 500));

      console.log(`[Consumer] ✓ Книга "${data.book.title}" обработана`);

      // Подтверждаем обработку — сообщение удаляется из очереди
      channel.ack(msg);
    } catch (err) {
      console.error('[Consumer] Ошибка:', err.message);
      // Возвращаем сообщение в очередь (requeue: true)
      channel.nack(msg, false, true);
    }
  });
}

startConsumer().catch((err) => {
  console.error('Ошибка запуска consumer:', err);
  process.exit(1);
});