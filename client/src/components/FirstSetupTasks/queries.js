import gql from "graphql-tag";

export const createMyTask = gql`
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
