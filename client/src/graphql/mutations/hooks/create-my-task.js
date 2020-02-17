import { useMutation } from "react-apollo";

import { CREATE_MY_TASK as mutation } from "..";

export default () => useMutation(mutation);
