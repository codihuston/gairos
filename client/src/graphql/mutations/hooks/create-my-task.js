import { useMutation } from "react-apollo";

import { CREATE_MY_TASK } from "..";

export default () => useMutation(CREATE_MY_TASK);
