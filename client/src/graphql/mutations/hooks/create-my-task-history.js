import { useMutation } from "react-apollo";

import { CREATE_MY_TASK_HISTORY as mutation } from "..";

export default () => useMutation(mutation);
