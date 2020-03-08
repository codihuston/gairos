import { useMutation } from "react-apollo";

import { DELETE_MY_TASK as mutation } from "..";

export default () => useMutation(mutation);
