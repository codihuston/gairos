import gql from "graphql-tag";

export const mockQueries = {};

export const mockMutations = {
  createMyTag: gql`
    mutation createMyTag(
      $name: String!
      $description: String
      $isPublic: Boolean
      $isArchived: Boolean
      $foregroundColor: HexColorCode
      $backgroundColor: HexColorCode
    ) {
      createMyTag(
        input: {
          name: $name
          description: $description
          isPublic: $isPublic
          isArchived: $isArchived
          foregroundColor: $foregroundColor
          backgroundColor: $backgroundColor
        }
      ) {
        id
        name
        createdAt
        updatedAt
        userTagInfo {
          id
          description
          isPublic
          isArchived
          foregroundColor
          backgroundColor
          createdAt
          updatedAt
        }
      }
    }
  `,
  renameMyTag: gql`
    mutation renameMyTag($userTagId: ID!, $name: String!) {
      renameMyTag(input: { userTagId: $userTagId, name: $name }) {
        id
        name
        userTagInfo {
          description
        }
      }
    }
  `,
  updateMyTag: gql`
    mutation updateMyTag(
      $userTagId: ID!
      $description: String
      $isPublic: Boolean
      $isArchived: Boolean
      $foregroundColor: HexColorCode
      $backgroundColor: HexColorCode
    ) {
      updateMyTag(
        input: {
          userTagId: $userTagId
          description: $description
          isPublic: $isPublic
          isArchived: $isArchived
          foregroundColor: $foregroundColor
          backgroundColor: $backgroundColor
        }
      ) {
        id
        description
        isPublic
        isArchived
        foregroundColor
        backgroundColor
        createdAt
        updatedAt
      }
    }
  `,
  deleteMyTag: gql`
    mutation deleteMyTag($userId: ID, $userTagId: ID!) {
      deleteMyTag(input: { userId: $userId, userTagId: $userTagId })
    }
  `,
  createMyTask: gql`
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
  `,
  renameMyTask: gql`
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
  `,
  updateMyTask: gql`
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
  `,
  deleteMyTask: gql`
    mutation($userId: ID, $userTaskId: ID!) {
      deleteMyTask(input: { userId: $userId, userTaskId: $userTaskId })
    }
  `,
  createMyTaskHistory: gql`
    mutation(
      $userTaskId: ID!
      $eventId: ID
      $startTime: GraphQLDateTime!
      $endTime: GraphQLDateTime
      $eventColorId: String
    ) {
      createMyTaskHistory(
        input: {
          userTaskId: $userTaskId
          eventId: $eventId
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
  `,
  updateMyTaskHistory: gql`
    mutation(
      $id: ID!
      $userTaskId: ID!
      $startTime: GraphQLDateTime!
      $endTime: GraphQLDateTime!
      $eventColorId: String
    ) {
      updateMyTaskHistory(
        input: {
          id: $id
          userTaskId: $userTaskId
          eventColorId: $eventColorId
          startTime: $startTime
          endTime: $endTime
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
            name
          }
        }
      }
    }
  `,
  deleteMyTaskHistory: gql`
    mutation($id: ID!) {
      deleteMyTaskHistory(input: { id: $id })
    }
  `,
  updateMyProfile: gql`
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
  `
};

export const mockResponses = {
  updateEventWithUserTask: {
    raw: variables => ({
      id: variables.eventId,
      summary: "SOME GOOGLE CALENDAR EVENT NAME",
      location: "SOME ADDRESS",
      description: "SOME DESCRIPTION",
      start: variables.startTime,
      end: variables.endTime,
      recurrence: ["SOME RECURRANCE VALUE"],
      reminders: {
        useDefault: true,
        overrides: []
      }
    }),
    reduced: variables => ({
      id: variables.eventId,
      summary: "SOME GOOGLE CALENDAR EVENT NAME",
      location: "SOME ADDRESS",
      description: "SOME DESCRIPTION",
      start: variables.startTime,
      end: variables.endTime,
      recurrence: ["SOME RECURRANCE VALUE"],
      reminders: {
        useDefault: true,
        overrides: []
      }
    })
  },
  createEventWithUserTask: {
    raw: variables => ({
      id: variables.eventId,
      summary: "SOME GOOGLE CALENDAR EVENT NAME",
      location: "SOME ADDRESS",
      description: "SOME DESCRIPTION",
      start: variables.startTime,
      end: variables.endTime,
      recurrence: ["SOME RECURRANCE VALUE"],
      reminders: {
        useDefault: true,
        overrides: []
      }
    }),
    reduced: variables => ({
      id: variables.eventId,
      summary: "SOME GOOGLE CALENDAR EVENT NAME",
      location: "SOME ADDRESS",
      description: "SOME DESCRIPTION",
      start: variables.startTime,
      end: variables.endTime,
      recurrence: ["SOME RECURRANCE VALUE"],
      reminders: {
        useDefault: true,
        overrides: []
      }
    })
  },
  deleteEvent: true
};
