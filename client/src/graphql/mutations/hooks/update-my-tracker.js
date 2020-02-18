import { useMutation } from "react-apollo";

import { UPDATE_MY_TRACKER as mutation } from "..";

export default () => useMutation(mutation);
