import { gql } from "apollo-boost";

export const getVersion = gql`
  query {
    version
  }
`;
