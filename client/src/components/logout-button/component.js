import React from "react";
import { useHistory, withRouter } from "react-router-dom";
import { withApollo } from "react-apollo";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faSignOut } from "@fortawesome/pro-duotone-svg-icons";

import { component as Loading } from "../loading";
import Logout from "../../graphql/mutations/hooks/logout";

function LogoutButton({ client }) {
  let history = useHistory();
  const [mutate, { data, loading }] = Logout();

  const handleClick = async e => {
    e.preventDefault();

    try {
      // remove the session from the server
      await mutate();

      // empty the cache
      localStorage.clear();
      // client.clearStore();

      // redirect to login?
      history.push("/login");
      window.location.reload();
    } catch (e) {
      console.error(e);
    }
  };

  if (loading) {
    return <Loading />;
  }

  return (
    <div onClick={handleClick}>
      <FontAwesomeIcon className="icon-fixed-width" icon={faSignOut} />
      Logout
    </div>
  );
}

export default withRouter(withApollo(LogoutButton));
