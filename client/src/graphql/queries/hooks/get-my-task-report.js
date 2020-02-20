import { useQuery } from "react-apollo";
import { merge } from "lodash";

import { GET_MY_TASK_REPORT as query } from "..";

const defaultOpts = {
  fetchPolicy: "cache-and-network"
};

export default opts => useQuery(query, merge(defaultOpts, opts));
