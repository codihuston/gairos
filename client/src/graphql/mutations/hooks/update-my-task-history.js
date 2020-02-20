import { useMutation } from "react-apollo";

import { UPDATE_MY_TASK_HISTORY as mutation } from "..";

export default () => useMutation(mutation);
