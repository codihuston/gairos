import { useMutation } from "react-apollo";

import { RENAME_MY_TASK as mutation } from "..";

export default () => useMutation(mutation);
