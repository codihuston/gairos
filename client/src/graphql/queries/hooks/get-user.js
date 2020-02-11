import { useQuery } from "react-apollo";
import { merge } from "lodash";

import { GET_ME } from "..";

const defaultOpts = {
  options: {
    fetchPolicy: "cache"
  }
};

export default opts => useQuery(GET_ME, merge(defaultOpts, opts));
