import React from "react";
import PropTypes from "prop-types";
import { ApolloProvider } from "react-apollo";
import { ToastContainer } from "react-toastify";

import "./scss/main.scss";
import "bootstrap/dist/css/bootstrap.min.css";
import "react-toastify/dist/ReactToastify.css";
import "@fortawesome/fontawesome-pro";
import { component as Login } from "./pages/login";
import Pages from "./pages";
import GetUser from "./graphql/queries/hooks/get-user";

/**
 * Login flow:
 * - click google sign in button
 * - redirected to api server to handle oauth auth code flow
 * - redirected to /login on front-end client
 * - conditionally redirected to /first-setup or /home
 *
 * NOTES:
 * - after login, the google button appears to be re-rendered
 * - sometimes, logout is required to be pressed twice
 */
function IsLoggedIn() {
  // try fetching user info from graphql server
  const { data } = GetUser();

  // if there is a response, we are logged in
  if (data && data.me) {
    return <Pages />;
  }
  return <Login />;
}

function App({ apolloClient, isLoading }) {
  if (isLoading) {
    return <div>Is loading!</div>;
  }

  return (
    <ApolloProvider client={apolloClient}>
      <ToastContainer />
      <IsLoggedIn />
    </ApolloProvider>
  );
}

App.propTypes = {
  apolloClient: PropTypes.object,
  isLoading: PropTypes.bool,
};

export default App;
