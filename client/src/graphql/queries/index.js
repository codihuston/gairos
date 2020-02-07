import gql from "graphql-tag";

export const GET_ME = gql`
  query {
    me {
      id
      username
      email
      isFirstSetupCompleted
      calendarId
      createdAt
      updatedAt
    }
  }
`;

export const GET_MY_CALENDARS = gql`
  query {
    getMyCalendars {
      id
      summary
      description
    }
  }
`;
