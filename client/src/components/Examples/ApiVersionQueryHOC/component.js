/**
 * See:
 * - https://www.apollographql.com/docs/react/api/react-hoc/
 * - this adds props to your component (this.props.data), which
 * includes data.loading, data.error, as well as data.<QUERY>, data.<MUTATION>,
 * which match the names of the query/mutation and contains the results from
 * the server
 */
import React from "react";
import { graphql } from "react-apollo";

import { getVersion } from "./queries";

class ApiVersion extends React.Component {
  render() {
    if (this.props.loading) {
      return <span>loading...</span>;
    }
    if (this.props.error) {
      return (
        <pre>
          Bad:{" "}
          {this.props.error.graphQLErrors.map(({ message }, i) => (
            <span key={i}>{message}</span>
          ))}
        </pre>
      );
    }
    return (
      <div>
        API Version (Using HOC via graphql() function):{" "}
        {this.props.data.version}
      </div>
    );
  }
}

export default graphql(getVersion)(ApiVersion);
