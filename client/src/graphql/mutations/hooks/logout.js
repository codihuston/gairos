import { useMutation } from "react-apollo";

import { LOGOUT as mutation } from "..";

export default () => useMutation(mutation);
