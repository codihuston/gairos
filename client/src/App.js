import React from "react";
import PropTypes from "prop-types";
import { ApolloProvider } from "react-apollo";
import { BrowserRouter as Router, Switch, Route, Link } from "react-router-dom";
import { useQuery } from "react-apollo";

import logo from "./logo.svg";
import "./App.css";
import { component as ExampleComponent } from "./components/Examples/ExampleComponent";
import GoogleSignInButton from "./components/GoogleSignInButton";
import { component as ApiVersionComponent } from "./components/Examples/ApiVersionQueryComponent";
import { component as APIVersionQueryHookComponent } from "./components/Examples/ApiVersionQueryHook";
import { component as APIVersionQueryHOC } from "./components/Examples/ApiVersionQueryHOC";
import { component as LoginComponent } from "./components/Login";

function App({ apolloClient, isLoading }) {
  if (isLoading) {
    return <div>Is loading!</div>;
  }

  return (
    <ApolloProvider client={apolloClient}>
      <Router>
        <div>TODO: IMPLEMENT NAVIGATION</div>
        <Switch>
          <Route path="/examples/api-version/higher-order-component">
            <APIVersionQueryHOC />
          </Route>
          <Route path="/examples/api-version/hook">
            <APIVersionQueryHookComponent />
          </Route>
          <Route path="/examples/api-version/component">
            <ApiVersionComponent />
          </Route>
          <Route path="/examples">
            <ExampleComponent />
          </Route>
          <Route path="/login">
            Now that my session cookie should be set, I should see if I can
            query myself...
            <LoginComponent></LoginComponent>
          </Route>
          <Route path="/">
            <div className="App">
              <header className="App-header">
                <img src={logo} className="App-logo" alt="logo" />
                <p>
                  Edit <code>src/App.js</code> and save to reload.
                </p>
                <a
                  className="App-link"
                  href="https://reactjs.org"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  Learn React
                </a>
                <GoogleSignInButton />
              </header>
            </div>
          </Route>
        </Switch>
      </Router>
    </ApolloProvider>
  );
}

App.propTypes = {
  apolloClient: PropTypes.object,
  isLoading: PropTypes.bool
};

export default App;
