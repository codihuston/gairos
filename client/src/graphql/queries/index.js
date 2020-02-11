import gql from "graphql-tag";

export const getVersion = gql`
  query {
    version
  }
`;

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

export const GET_MY_TASKS = gql`
  query {
    getMyTasks {
      id
      name
      userTaskInfo {
        description
        isPublic
      }
    }
  }
`;
