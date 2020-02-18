import { useMutation } from "react-apollo";

import { DELETE_MY_TRACKER as mutation } from "..";

export default () => useMutation(mutation);
