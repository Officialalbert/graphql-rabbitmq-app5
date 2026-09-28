const {
  authors,
  books,
  getNextBookId,
  getNextAuthorId,
} = require('./data');
const { publishBookCreated } = require('./rabbitmq');

const resolvers = {
  Query: {
    // Все книги
    books: () => books,

    // Одна книга по id
    book: (_, { id }) => books.find((b) => b.id === id) || null,

    // Все авторы
    authors: () => authors,

    // Один автор по id
    author: (_, { id }) => authors.find((a) => a.id === id) || null,
  },

  Mutation: {
    // Создание книги — с отправкой в RabbitMQ
    createBook: async (_, { title, year, authorId }) => {
      const authorExists = authors.some((a) => a.id === authorId);
      if (!authorExists) {
        throw new Error(`Author with id=${authorId} not found`);
      }

      const newBook = {
        id: getNextBookId(),
        title,
        year,
        authorId,
      };
      books.push(newBook);

      // Отправляем событие в очередь
      await publishBookCreated(newBook);

      return newBook;
    },

    // Создание автора
    createAuthor: (_, { name, country }) => {
      const newAuthor = {
        id: getNextAuthorId(),
        name,
        country,
      };
      authors.push(newAuthor);
      return newAuthor;
    },
  },

  // Резолверы связей между типами
  Author: {
    // parent = объект Author, для которого надо найти книги
    books: (parent) => books.filter((b) => b.authorId === parent.id),
  },

  Book: {
    // parent = объект Book, для которого надо найти автора
    author: (parent) => authors.find((a) => a.id === parent.authorId),
  },
};

module.exports = { resolvers };