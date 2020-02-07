import gql from "graphql-tag";

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
