import gql from "graphql-tag";

export const GET_MY_CALENDARS = gql`
  query {
    getMyCalendars {
      id
      summary
      description
    }
  }
`;

export const CREATE_MY_CALENDAR = gql`
  mutation($summary: String!, $description: String) {
    createMyCalendar(summary: $summary, description: $description) {
      id
      summary
      description
    }
  }
`;
