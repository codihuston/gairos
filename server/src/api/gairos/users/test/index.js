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
      $foregroundColor: HexColorCode
      $backgroundColor: HexColorCode
    ) {
      createMyTask(
        input: {
          name: $name
          description: $description
          foregroundColor: $foregroundColor
          backgroundColor: $backgroundColor
        }
      ) {
        id
        name
        createdAt
        updatedAt
        userTaskInfo {
          id
          description
          foregroundColor
          backgroundColor
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
      $foregroundColor: HexColorCode
      $backgroundColor: HexColorCode
    ) {
      updateMyTask(
        input: {
          userTaskId: $userTaskId
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
  deleteMyTask: gql`
    mutation($userId: ID, $userTaskId: ID!) {
      deleteMyTask(input: { userId: $userId, userTaskId: $userTaskId })
    }
  `,
  createMyTaskHistory: gql`
    mutation(
      $userTaskId: ID!
      $googleEventId: ID
      $startTime: GraphQLDateTime!
      $endTime: GraphQLDateTime
      $eventHexColorCode: HexColorCode
    ) {
      createMyTaskHistory(
        input: {
          userTaskId: $userTaskId
          googleEventId: $googleEventId
          startTime: $startTime
          endTime: $endTime
          eventHexColorCode: $eventHexColorCode
        }
      ) {
        id
        startTime
        endTime
        googleEventId
        eventHexColorCode
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
      $eventHexColorCode: HexColorCode
    ) {
      updateMyTaskHistory(
        input: {
          id: $id
          userTaskId: $userTaskId
          eventHexColorCode: $eventHexColorCode
          startTime: $startTime
          endTime: $endTime
        }
      ) {
        id
        startTime
        endTime
        googleEventId
        eventHexColorCode
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
      $calendarHexColorCode: HexColorCode
    ) {
      updateMyProfile(
        input: {
          username: $username
          email: $email
          isFirstSetupCompleted: $isFirstSetupCompleted
          calendarId: $calendarId
          calendarHexColorCode: $calendarHexColorCode
        }
      ) {
        id
        username
        email
        isFirstSetupCompleted
        calendarId
        calendarHexColorCode
        createdAt
        updatedAt
      }
    }
  `
};

export const mockResponses = {
  updateEvent: {
    raw: variables => ({
      id: variables.googleEventId,
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
      id: variables.googleEventId,
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
      id: variables.googleEventId,
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
      id: variables.googleEventId,
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
  }
};
