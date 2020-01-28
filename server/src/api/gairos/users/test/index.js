import gql from "graphql-tag";

export const mockQueries = {};

export const mockMutations = {
  createMyTag: gql`
    mutation createMyTag(
      $name: String!
      $description: String
      $isPublic: Boolean
      $isArchived: Boolean
    ) {
      createMyTag(
        input: {
          name: $name
          description: $description
          isPublic: $isPublic
          isArchived: $isArchived
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
          createdAt
          updatedAt
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
    ) {
      updateMyTag(
        input: {
          userTagId: $userTagId
          description: $description
          isPublic: $isPublic
          isArchived: $isArchived
        }
      ) {
        id
        description
        isPublic
        isArchived
        createdAt
        updatedAt
      }
    }
  `
};

export const mockResponses = {};
