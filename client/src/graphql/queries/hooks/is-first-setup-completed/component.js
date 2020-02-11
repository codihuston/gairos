import React from "react";
import { Redirect } from "react-router-dom";

import { component as GetCachedUser } from "../get-cached-user";

export default function IsFirstSetupCompleted() {
  const user = GetCachedUser();

  console.log("Cached user", user);

  return user && user.isFirstSetupCompleted ? (
    <Redirect to="/home" />
  ) : (
    <Redirect to="/first-setup" />
  );
}
