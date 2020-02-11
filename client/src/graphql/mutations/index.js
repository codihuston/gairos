import gql from "graphql-tag";

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

export const DELETE_MY_TASK = gql`
  mutation($userTaskId: ID!) {
    deleteMyTask(input: { userTaskId: $userTaskId })
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
