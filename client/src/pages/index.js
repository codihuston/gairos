import React from "react";
import { BrowserRouter as Router, Switch, Route } from "react-router-dom";

import logo from "../logo.svg";
import { component as ExampleComponent } from "../components/Examples/ExampleComponent";
import { component as ApiVersionComponent } from "../components/Examples/ApiVersionQueryComponent";
import { component as APIVersionQueryHookComponent } from "../components/Examples/ApiVersionQueryHook";
import { component as APIVersionQueryHOC } from "../components/Examples/ApiVersionQueryHOC";
import { component as FirstSetupComponent } from "../components/FirstSetup";

export default function Pages() {
  return (
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
        {/* <Route path="/login">
          Now that my session cookie should be set, I should see if I can query
          myself...
          <LoginComponent />
        </Route> */}
        <Route path="/first-setup" component={FirstSetupComponent}></Route>
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
            </header>
          </div>
        </Route>
      </Switch>
    </Router>
  );
}
