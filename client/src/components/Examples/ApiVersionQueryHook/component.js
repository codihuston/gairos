/**
 * See:
 * - https://www.apollographql.com/docs/react/data/queries/#prerequisites
 * - in the code editor on the docs site, select "HOOKS (JS)" from the dropdown
 */
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
