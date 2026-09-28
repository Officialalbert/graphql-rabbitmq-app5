// Простые in-memory хранилища (в реальном проекте — БД)
const authors = [
  { id: '1', name: 'Лев Толстой', country: 'Россия' },
  { id: '2', name: 'Джордж Оруэлл', country: 'Великобритания' },
];

const books = [
  { id: '1', title: 'Война и мир', year: 1869, authorId: '1' },
  { id: '2', title: 'Анна Каренина', year: 1877, authorId: '1' },
  { id: '3', title: '1984', year: 1949, authorId: '2' },
];

// Простой счётчик для новых ID
let nextBookId = 4;
let nextAuthorId = 3;

module.exports = {
  authors,
  books,
  getNextBookId: () => String(nextBookId++),
  getNextAuthorId: () => String(nextAuthorId++),
};