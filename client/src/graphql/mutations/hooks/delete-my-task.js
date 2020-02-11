import { useMutation } from "react-apollo";

import gql from "graphql-tag";

export default id =>
  useMutation(
    gql`
      mutation($userTaskId: ID!) {
        deleteMyTask(input: { userTaskId: $userTaskId })
      }
    `
  );
