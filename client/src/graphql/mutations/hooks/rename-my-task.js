import { useMutation } from "react-apollo";

import { RENAME_MY_TASK } from "..";

export default () => useMutation(RENAME_MY_TASK);
