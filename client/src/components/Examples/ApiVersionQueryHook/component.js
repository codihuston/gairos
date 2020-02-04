import React from "react";
import { useQuery } from "react-apollo";

import { getVersion } from "./queries";

function ApiVersion() {
  const { loading, error, data } = useQuery(getVersion);

  if (loading) return "Loading...";
  if (error) return `Error! ${error.message}`;

  return <div>API Version (Using Hooks): {data.version}</div>;
}

export default ApiVersion;
