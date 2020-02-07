import React from "react";
import PropTypes from "prop-types";
import { graphql } from "react-apollo";
import { Redirect } from "react-router-dom";

import { GET_ME } from "./queries";
import GoogleSignInButton from "../../components/google-login-button";
import { component as Loading } from "../../components/LoadingComponent";

export default function Login() {
  // TODO: style this landing page!
  return <GoogleSignInButton />;
}
