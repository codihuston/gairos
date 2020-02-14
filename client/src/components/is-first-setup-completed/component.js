import React from "react";
import { Redirect } from "react-router-dom";

import GetUser from "../../graphql/queries/hooks/get-user";

export default function IsFirstSetupCompleted() {
  const { data } = GetUser();

  return data && data.me && data.me.isFirstSetupCompleted ? (
    <Redirect to="/home" />
  ) : (
    <Redirect to="/first-setup" />
  );
}
