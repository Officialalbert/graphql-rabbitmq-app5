# GraphQL + RabbitMQ

## Стек
- Node.js + Apollo Server (GraphQL)
- RabbitMQ (amqplib)

## Запуск
В 1 варианте, просто docker compose up, если не получиться, то 2 вариант:
1. `docker compose up -d` — запуск RabbitMQ
2. `npm install`
3. `npm start` — GraphQL API на http://localhost:4000
4. `npm run consumer` — Consumer в отдельном терминале

## Проверка
Откройте http://localhost:4000 — Apollo Sandbox.
Создайте книгу через Mutation — сообщение появится в RabbitMQ.
Web UI RabbitMQ: http://localhost:15672 (guest/guest)

## Схема GraphQL
Author { id, name, country, books }
Book { id, title, year, author }
Query: books, book(id), authors, author(id)
Mutation: createBook, createAuthor
