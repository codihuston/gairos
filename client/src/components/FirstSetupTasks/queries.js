import gql from "graphql-tag";

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
