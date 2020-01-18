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
  },
  reduceTaskHistory: {
    input: [
      {
        id: "1bdc487a-8ad7-4264-b28d-d02dbbef786a",
        name: "Sample Task",
        createdAt: "2020-01-18T20:32:37.189Z",
        updatedAt: "2020-01-18T20:32:37.189Z",
        userTaskHistory: {
          userId: "0bdc487a-8ad7-4264-b28d-d02dbbef787b",
          taskId: "1bdc487a-8ad7-4264-b28d-d02dbbef786a",
          startTime: "2020-01-18T20:34:11.600Z",
          endTime: "2020-01-18T20:34:11.600Z",
          createdAt: "2020-01-18T20:34:11.605Z",
          updatedAt: "2020-01-18T20:34:11.605Z"
        }
      }
    ],
    output: [
      {
        id: "1bdc487a-8ad7-4264-b28d-d02dbbef786a",
        name: "Sample Task",
        startTime: "2020-01-18T20:34:11.600Z",
        endTime: "2020-01-18T20:34:11.600Z",
        createdAt: "2020-01-18T20:34:11.605Z",
        updatedAt: "2020-01-18T20:34:11.605Z"
      }
    ]
  }
};
