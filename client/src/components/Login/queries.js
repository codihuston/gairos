import gql from "graphql-tag";

export const me = gql`
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
