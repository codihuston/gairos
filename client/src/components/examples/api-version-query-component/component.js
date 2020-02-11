/**
 * See:
 * - https://www.apollographql.com/docs/react/api/react-components/#query
 * - https://www.apollographql.com/docs/react/data/queries/#prerequisites
 * - in the code editor on the docs site, select "JavaScript" from the dropdown
 */
import React from "react";
import { Query } from "react-apollo";

import { getVersion } from "../../../graphql/queries";
import { component as Loading } from "../../loading";

class ApiVersion extends React.Component {
  render() {
    return (
      <Query query={getVersion} errorPolicy="all">
        {({ error, data, loading }) => {
          if (loading) {
            return <Loading />;
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
          return <div>API Version (Using Query Component): {data.version}</div>;
        }}
      </Query>
    );
  }
}

export default ApiVersion;
