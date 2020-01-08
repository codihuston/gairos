import { gql } from "apollo-server-express";

export default gql`
  type Query {
    hello: String
    getCalendars: [Calendar]
  }

  type Calendar {
    id: String
    summary: String
    description: String
  }
`;
