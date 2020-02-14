import React from "react";
import { withApollo } from "react-apollo";
import GoogleSignInButton from "../../components/google-login-button";

function Logout({ client }) {
  // TODO: style this landing page!
  console.log("CLIENT", client);
  // client.writeData({data: })
  return <div>Remove session and redirect to login?</div>;
}

export default withApollo(Logout);
