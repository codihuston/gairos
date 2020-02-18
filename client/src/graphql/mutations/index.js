import gql from "graphql-tag";

/*******************************************************************************
 * Local (Client only)
 ******************************************************************************/
export const CREATE_MY_TRACKER = gql`
  mutation(
    $id: ID!
    $task: Task!
    $isTracking: Boolean
    $startTime: String
    $elapsedTime: String
    $originalTime: String
  ) {
    addTracker(
      id: $id
      task: $task
      isTracking: $isTracking
      startTime: $startTime
      elapsedTime: $elapsedTime
      originalTime: $originalTime
    ) @client
  }
`;

export const UPDATE_MY_TRACKER = gql`
  mutation(
    $id: ID!
    $task: Task!
    $isTracking: Boolean
    $startTime: String
    $elapsedTime: String
    $originalTime: String
  ) {
    updateTracker(
      id: $id
      task: $task
      isTracking: $isTracking
      startTime: $startTime
      elapsedTime: $elapsedTime
      originalTime: $originalTime
    ) @client
  }
`;

export const DELETE_MY_TRACKER = gql`
  mutation($id: ID!) {
    deleteTracker(id: $id) @client
  }
`;

/*******************************************************************************
 * Auth
 ******************************************************************************/
export const LOGOUT = gql`
  mutation {
    logout
  }
`;

/*******************************************************************************
 * Calendar
 ******************************************************************************/
export const CREATE_MY_CALENDAR = gql`
  mutation($summary: String!, $description: String) {
    createMyCalendar(summary: $summary, description: $description) {
      id
      summary
      description
    }
  }
`;

/*******************************************************************************
 * Tasks
 ******************************************************************************/
export const CREATE_MY_TASK = gql`
  mutation createMyTask(
    $name: String!
    $description: String
    $eventColorId: String
  ) {
    createMyTask(
      input: {
        name: $name
        description: $description
        eventColorId: $eventColorId
      }
    ) {
      id
      name
      createdAt
      updatedAt
      userTaskInfo {
        id
        description
        eventColorId
        createdAt
        updatedAt
      }
    }
  }
`;

export const UPDATE_MY_TASK = gql`
  mutation(
    $userTaskId: ID!
    $description: String
    $isPublic: Boolean
    $isArchived: Boolean
    $eventColorId: String
  ) {
    updateMyTask(
      input: {
        userTaskId: $userTaskId
        description: $description
        isPublic: $isPublic
        isArchived: $isArchived
        eventColorId: $eventColorId
      }
    ) {
      id
      description
      isPublic
      isArchived
      eventColorId
      createdAt
      updatedAt
    }
  }
`;

export const RENAME_MY_TASK = gql`
  mutation renameMyTask($userTaskId: ID!, $name: String!) {
    renameMyTask(input: { userTaskId: $userTaskId, name: $name }) {
      id
      name
      userTaskInfo {
        id
        description
        isPublic
        task {
          id
          name
        }
      }
    }
  }
`;

export const DELETE_MY_TASK = gql`
  mutation($userTaskId: ID!) {
    deleteMyTask(input: { userTaskId: $userTaskId })
  }
`;

/*******************************************************************************
 * User Task History
 ******************************************************************************/
export const CREATE_MY_TASK_HISTORY = gql`
  mutation(
    $userTaskId: ID!
    $startTime: GraphQLDateTime!
    $endTime: GraphQLDateTime
    $eventColorId: String
  ) {
    createMyTaskHistory(
      input: {
        userTaskId: $userTaskId
        startTime: $startTime
        endTime: $endTime
        eventColorId: $eventColorId
      }
    ) {
      id
      startTime
      endTime
      eventId
      eventColorId
      createdAt
      updatedAt
      userTaskInfo {
        id
        description
        task {
          id
          name
        }
      }
    }
  }
`;

/*******************************************************************************
 * User Profile
 ******************************************************************************/
export const UPDATE_MY_PROFILE = gql`
  mutation(
    $username: String
    $email: EmailAddress
    $isFirstSetupCompleted: Boolean
    $calendarId: ID
    $calendarColorId: String
    $scheduleCalendarId: ID
    $scheduleCalendarColorId: String
  ) {
    updateMyProfile(
      input: {
        username: $username
        email: $email
        isFirstSetupCompleted: $isFirstSetupCompleted
        calendarId: $calendarId
        calendarColorId: $calendarColorId
        scheduleCalendarId: $scheduleCalendarId
        scheduleCalendarColorId: $scheduleCalendarColorId
      }
    ) {
      id
      username
      email
      isFirstSetupCompleted
      calendarId
      calendarColorId
      scheduleCalendarId
      scheduleCalendarColorId
      createdAt
      updatedAt
    }
  }
`;
