import gql from "graphql-tag";

export const getMyCalendars = gql`
  query {
    getMyCalendars {
      id
      summary
      description
    }
  }
`;
