import React from "react";
import {
  BrowserRouter as Router,
  Switch,
  Route,
  Redirect
} from "react-router-dom";

import logo from "../logo.svg";

// logical components
import { component as IsFirstSetupCompleted } from "../components/is-first-setup-completed";
import { component as ExampleComponent } from "../components/examples/example-component";
import { component as ApiVersionComponent } from "../components/examples/api-version-query-component";
import { component as APIVersionQueryHookComponent } from "../components/examples/api-version-query-hook";
import { component as APIVersionQueryHOC } from "../components/examples/api-version-query-higher-order-component";
// pages
import { component as FirstSetup } from "./first-setup";
import { component as Home } from "./home";

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
        <Route path="/home" component={Home}></Route>
        <Route path="/">
          <Redirect to="/home" />
        </Route>
      </Switch>
    </Router>
  );
}
