import React from "react";
import { graphql } from "react-apollo";
import { Redirect } from "react-router-dom";

import { me } from "./queries";
import GoogleSignInButton from "../GoogleSignInButton";
import { component as Loading } from "../LoadingComponent";

class LoginComponent extends React.Component {
  render() {
    if (this.props.data.loading) {
      return <Loading />;
    }

    // if there are any errors at all, assume login failed, show them
    // login button
    if (this.props.data.error) {
      return (
        <div>
          <pre>
            Login failed!{" "}
            {this.props.data.error.graphQLErrors.map(({ message }, i) => (
              <span key={i}>{message}</span>
            ))}
          </pre>
          <div>
            <GoogleSignInButton />
          </div>
        </div>
      );
    } else {
      const { me } = this.props.data;

      // if first setup is completed
      if (me.isFirstSetupCompleted) {
        // send them home!
        return <Redirect to="/home" />;
      }
      // otherwise, walk through first-setup
      else {
        return <Redirect to="/first-setup/calendar" />;
      }
    }
  }
}

export default graphql(me, {
  options: {
    // pull from network only (not apollo cache)
    fetchPolicy: "network-only"
  }
})(LoginComponent);
