const { ApolloServer } = require('@apollo/server');
const { startStandaloneServer } = require('@apollo/server/standalone');

const { typeDefs } = require('./schema');
const { resolvers } = require('./resolvers');
const { connectRabbitMQ } = require('./rabbitmq');

async function start() {
  // 1. Подключаем RabbitMQ до старта сервера
  await connectRabbitMQ();

  // 2. Создаём Apollo Server
  const server = new ApolloServer({
    typeDefs,
    resolvers,
  });

  // 3. Запускаем — Apollo автоматически раздаёт Sandbox на /graphql
  const { url } = await startStandaloneServer(server, {
    listen: { port: 4000 },
  });

  console.log(`[GraphQL] Сервер готов: ${url}`);
}

start().catch((err) => {
  console.error('Ошибка запуска:', err);
  process.exit(1);
});