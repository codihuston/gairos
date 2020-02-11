import { useMutation } from "react-apollo";

import { DELETE_MY_TASK } from "..";

export default id => useMutation(DELETE_MY_TASK);
