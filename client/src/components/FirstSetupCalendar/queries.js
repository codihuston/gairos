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

export const createMyCalendar = gql`
  mutation($summary: String!, $description: String) {
    createMyCalendar(summary: $summary, description: $description) {
      id
      summary
      description
    }
  }
`;
