import { gql } from "apollo-server-express";

export default gql`
  type Query {
    hello: String
    getCalendars: [Calendar]
    me: User
  }

  type Calendar {
    id: String
    summary: String
    description: String
  }

  type User {
    id: ID!
    username: String!
  }
`;
