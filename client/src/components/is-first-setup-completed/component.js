import React from "react";
import { Redirect } from "react-router-dom";

import { component as GetUser } from "../../graphql/queries/hooks/get-user";

export default function IsFirstSetupCompleted() {
  const user = GetUser();

  console.log("User", user);

  return user && user.isFirstSetupCompleted ? (
    <Redirect to="/home" />
  ) : (
    <Redirect to="/first-setup" />
  );
}
