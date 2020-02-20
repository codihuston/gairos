import { useMutation } from "react-apollo";

import { DELETE_MY_TASK_HISTORY as mutation } from "..";

export default () => useMutation(mutation);
