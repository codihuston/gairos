import React from "react";
import { graphql } from "react-apollo";

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
      console.log(this.props);
      // TODO: if we get here, the user is logged in, redirect to homepage
      return <div>My Info: Username: {this.props.data.me.username} </div>;
    }
  }
}

// TODO: this query, at least in this context, must always be pulled freshly
// (not from the apollo cache)!
export default graphql(me)(LoginComponent);
