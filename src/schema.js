const typeDefs = `#graphql
  type Author {
    id: ID!
    name: String!
    country: String!
    books: [Book!]!          # вложенный резолвер
  }

  type Book {
    id: ID!
    title: String!
    year: Int!
    author: Author!          # вложенный резолвер
  }

  type Query {
    books: [Book!]!
    book(id: ID!): Book
    authors: [Author!]!
    author(id: ID!): Author
  }

  type Mutation {
    createBook(title: String!, year: Int!, authorId: ID!): Book!
    createAuthor(name: String!, country: String!): Author!
  }
`;

module.exports = { typeDefs };