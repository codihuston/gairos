import React from "react";
import { Query } from "react-apollo";

import { getVersion } from "./queries";

class ApiVersion extends React.Component {
  render() {
    return (
      <Query query={getVersion} errorPolicy="all">
        {({ error, data, loading }) => {
          if (loading) {
            return <span>loading...</span>;
          }
          if (error) {
            return (
              <pre>
                Bad:{" "}
                {error.graphQLErrors.map(({ message }, i) => (
                  <span key={i}>{message}</span>
                ))}
              </pre>
            );
          }
          return <div>API Version: {data.version}</div>;
        }}
      </Query>
    );
  }
}

export default ApiVersion;
