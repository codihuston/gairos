import { useQuery } from "react-apollo";
import { merge } from "lodash";

import { GET_MY_TASKS as query } from "..";

const defaultOpts = {
  fetchPolicy: "cache-only"
};

export default opts => useQuery(query, merge(defaultOpts, opts));
