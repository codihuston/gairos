import { useQuery } from "react-apollo";
import { merge } from "lodash";

import { GET_ME } from "../..";

export default function(opts) {
  const defaultOpts = {
    options: {
      fetchPolicy: "cache"
    }
  };

  const { data } = useQuery(GET_ME, merge(defaultOpts, opts));

  return data && data.me ? data.me : null;
}
