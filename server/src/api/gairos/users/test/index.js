import gql from "graphql-tag";

export const mockQueries = {};

export const mockMutations = {
  createMyTag: gql`
    mutation createMyTag(
      $name: String!
      $description: String
      $isPublic: Boolean
    ) {
      createMyTag(
        input: { name: $name, description: $description, isPublic: $isPublic }
      ) {
        id
        name
        createdAt
        updatedAt
        userTagInfo {
          description
          isPublic
          createdAt
          updatedAt
        }
      }
    }
  `
};

export const mockResponses = {};
