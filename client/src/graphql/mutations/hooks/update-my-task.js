import { useMutation } from "react-apollo";

import { UPDATE_MY_TASK as mutation } from "..";

export default () => useMutation(mutation);
