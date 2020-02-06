import gql from "graphql-tag";

export const me = gql`
  query {
    getMyCalendars {
      id
      summary
      description
    }
  }
`;
