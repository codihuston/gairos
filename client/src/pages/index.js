import React from "react";
import { BrowserRouter as Router, Switch, Route } from "react-router-dom";

import logo from "../logo.svg";

import { component as IsFirstSetupCompleted } from "../components/is-first-setup-completed";
import { component as FirstSetup } from "./first-setup";
import { component as ExampleComponent } from "../components/Examples/ExampleComponent";
import { component as ApiVersionComponent } from "../components/Examples/ApiVersionQueryComponent";
import { component as APIVersionQueryHookComponent } from "../components/Examples/ApiVersionQueryHook";
import { component as APIVersionQueryHOC } from "../components/Examples/ApiVersionQueryHOC";

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
        <Route path="/login">
          <IsFirstSetupCompleted />
        </Route>
        <Route path="/first-setup" component={FirstSetup}></Route>
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
