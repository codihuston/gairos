import React from "react";
import { ApolloProvider } from "react-apollo";

import logo from "./logo.svg";
import "./App.css";
import "./config/globals";
import { component as ExampleComponent } from "./components/ExampleComponent";
import GoogleSignInButton from "./components/GoogleSignInButton";

function App({ apolloClient, isLoading }) {
  if (isLoading) {
    return <div>Is loading!</div>;
  }

  return (
    <ApolloProvider client={apolloClient}>
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
          <ExampleComponent />
          <GoogleSignInButton />
        </header>
      </div>
    </ApolloProvider>
  );
}

export default App;
