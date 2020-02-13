import React from "react";
import PropTypes from "prop-types";
import { ApolloProvider, useQuery } from "react-apollo";
import { ToastContainer } from "react-toastify";

import "./scss/main.scss";
import "bootstrap/dist/css/bootstrap.min.css";
import "react-toastify/dist/ReactToastify.css";
import "@fortawesome/fontawesome-pro";
import { component as Login } from "./pages/login";
import Pages from "./pages";
import { GET_ME } from "./graphql/queries";

function IsLoggedIn() {
  const { data } = useQuery(GET_ME);

  return data && data.me ? <Pages /> : <Login />;
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
  isLoading: PropTypes.bool
};

export default App;
