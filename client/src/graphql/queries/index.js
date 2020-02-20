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
        id
        description
        isPublic
        isArchived
        createdAt
        updatedAt
      }
      createdAt
      updatedAt
    }
  }
`;

export const GET_MY_TRACKERS = gql`
  query {
    getTrackers @client {
      id
      isTracking
      startTime
      originalTime
      elapsedTime
      task {
        id
        name
        userTaskInfo {
          id
          description
          isPublic
          isArchived
        }
        createdAt
        updatedAt
      }
    }
  }
`;

export const GET_MY_TASK_HISTORY = gql`
  query {
    getMyTaskHistory {
      id
      startTime
      endTime
      eventColorId
      createdAt
      updatedAt
      userTaskInfo {
        id
        description
        isPublic
        isArchived
        task {
          id
          name
        }
      }
    }
  }
`;

export const GET_MY_TASK_REPORT = gql`
  query {
    getMyTaskReport {
      taskId
      userTaskId
      name
      description
      exact {
        years
        months
        days
        hours
        minutes
        seconds
      }
      seconds
      minutes
      hours
      days
      weeks
    }
  }
`;
