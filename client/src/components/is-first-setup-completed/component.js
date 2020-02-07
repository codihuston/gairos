import React from "react";
import { Redirect } from "react-router-dom";
import { useQuery } from "react-apollo";

import { GET_ME } from "../../graphql/queries";

export const GetCachedUser = () => {
  const { data } = useQuery(GET_ME, {
    options: {
      fetchPolicy: "cache"
    }
  });

  return data && data.me ? data.me : null;
};

export default function IsFirstSetupCompleted() {
  const user = GetCachedUser();

  console.log("Cached user", user);

  return user && user.isFirstSetupCompleted ? (
    <Redirect to="/home" />
  ) : (
    <Redirect to="/first-setup" />
  );
}
