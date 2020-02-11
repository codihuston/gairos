import { useQuery } from "react-apollo";

import { GET_ME } from "../../";

export default function() {
  const { data } = useQuery(GET_ME, {
    options: {
      fetchPolicy: "cache"
    }
  });

  return data && data.me ? data.me : null;
}
