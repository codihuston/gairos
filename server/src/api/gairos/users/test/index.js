import gql from "graphql-tag";

export const mockQueries = {};

export const mockMutations = {};

export const mockResponses = {
  reduceTaskHistory: {
    input: [
      {
        id: 1,
        userId: "0bdc487a-8ad7-4264-b28d-d02dbbef787b",
        taskId: "1bdc487a-8ad7-4264-b28d-d02dbbef786a",
        googleEventId: "SOME_ID",
        startTime: "2020-01-20T21:52:44.815Z",
        endTime: "2020-01-20T21:52:44.815Z",
        createdAt: "2020-01-20T21:52:44.815Z",
        updatedAt: "2020-01-20T21:52:44.815Z",
        task: {
          id: "1bdc487a-8ad7-4264-b28d-d02dbbef786a",
          name: "Sample Task",
          createdAt: "2020-01-20T21:52:44.760Z",
          updatedAt: "2020-01-20T21:52:44.760Z",
          userTaskInfo: {
            userId: "0bdc487a-8ad7-4264-b28d-d02dbbef787b",
            taskId: "1bdc487a-8ad7-4264-b28d-d02dbbef786a",
            description: "some description",
            isPublic: true,
            createdAt: "2020-01-20T21:52:44.808Z",
            updatedAt: "2020-01-20T21:52:44.808Z"
          }
        }
      }
    ],
    output: [
      {
        userId: "0bdc487a-8ad7-4264-b28d-d02dbbef787b",
        taskId: "1bdc487a-8ad7-4264-b28d-d02dbbef786a",
        name: "Sample Task",
        description: "some description",
        googleEventId: "SOME_ID",
        startTime: "2020-01-20T21:52:44.815Z",
        endTime: "2020-01-20T21:52:44.815Z",
        createdAt: "2020-01-20T21:52:44.815Z",
        updatedAt: "2020-01-20T21:52:44.815Z"
      }
    ]
  }
};
