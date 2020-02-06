import React, { useState } from "react";
import PropTypes from "prop-types";
import { graphql } from "react-apollo";
import { useQuery } from "react-apollo";

import { getMyCalendars } from "./queries";
import GoogleSignInButton from "../GoogleSignInButton";
import { component as Loading } from "../LoadingComponent";

function CreateCalendarComponent(props) {
  const { loading, error, data } = useQuery(getMyCalendars);

  const [calendar, setCalendar] = useState(null);

  const onBlur = event => {
    setCalendar(event.target.value);
  };

  const onSubmit = event => {
    props.handleSetCalendar(calendar);
  };

  console.log("props", props);

  if (loading) {
    return <Loading />;
  }

  // if there are any errors at all, assume login failed, show them
  // login button
  if (error) {
    return (
      <div>
        <pre>
          Login failed!{" "}
          {error.graphQLErrors.map(({ message }, i) => (
            <span key={i}>{message}</span>
          ))}
        </pre>
        <div>
          <GoogleSignInButton />
        </div>
      </div>
    );
  } else {
    const { getMyCalendars } = data;
    return (
      <div>
        <div>
          <input type="text" onBlur={onBlur} placeholder="enter a name"></input>
          <button onClick={onSubmit}>Next</button>
        </div>
        {/* todo, filter out this list on change; if not exist, say
          we will create this calendar */}
        <ul>
          {getMyCalendars.map((calendar, i) => {
            return <li key={i}>{calendar.summary}</li>;
          })}
        </ul>
      </div>
    );
  }
}

CreateCalendarComponent.propTypes = {
  data: PropTypes.shape({
    loading: PropTypes.bool,
    getMyCalendars: PropTypes.arrayOf(
      PropTypes.shape({
        id: PropTypes.string,
        summary: PropTypes.string,
        description: PropTypes.string
      })
    ),
    error: PropTypes.object
  })
};

export default graphql(getMyCalendars, {
  options: {
    fetchPolicy: "cache-and-network"
  }
})(CreateCalendarComponent);
