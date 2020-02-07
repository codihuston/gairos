import React from "react";
import PropTypes from "prop-types";
import { ApolloProvider, useQuery } from "react-apollo";

import "./scss/main.scss";
import { component as Login } from "./pages/login";
import Pages from "./pages";
import { GET_ME } from "./queries";

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
      <IsLoggedIn />
    </ApolloProvider>
  );
}

App.propTypes = {
  apolloClient: PropTypes.object,
  isLoading: PropTypes.bool
};

export default App;
