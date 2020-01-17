import gql from "graphql-tag";

export const mockQueries = {};

export const mockMutations = {};

export const mockResponses = {
  reduceTasks: {
    input: [
      {
        id: "1bdc487a-8ad7-4264-b28d-d02dbbef786a",
        name: "Sample Task",
        userTask: {
          description: "some description",
          isPublic: true
        }
      }
    ],
    output: [
      {
        id: "1bdc487a-8ad7-4264-b28d-d02dbbef786a",
        name: "Sample Task",
        description: "some description",
        isPublic: true
      }
    ]
  }
};
