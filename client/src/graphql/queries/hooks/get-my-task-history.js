import { useQuery } from "react-apollo";
import { merge } from "lodash";

import { GET_MY_TASK_HISTORY as query } from "..";

const defaultOpts = {};

export default opts => useQuery(query, merge(defaultOpts, opts));
