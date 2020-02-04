import React from "react";
import { graphql } from "react-apollo";

import { getVersion } from "./queries";

class ApiVersion extends React.Component {
  render() {
    const { version } = this.props.data;

    if (!version) {
      return <div>Loading...</div>;
    }
    return <div>API Version: {version}</div>;
  }
}

export default graphql(getVersion)(ApiVersion);
