import React, { useState } from "react";
import PropTypes from "prop-types";
import { useQuery } from "react-apollo";
import { Link } from "react-router-dom";

import { GET_MY_CALENDARS } from "./queries";
import GoogleSignInButton from "../GoogleSignInButton";
import { component as Loading } from "../LoadingComponent";

export const CalendarNameInput = ({ onChange, value }) => {
  return (
    <div>
      <label htmlFor="name">Calendar Name:</label>
      <input
        id="summary"
        type="text"
        onChange={onChange}
        placeholder="Enter a calendar name"
        value={value ? value : ""}
      ></input>
    </div>
  );
};

export const CalendarList = ({ calendars, name }) => {
  if (calendars.length) {
    return (
      <div>
        <h3>Your Google Calendars</h3>
        {calendars}
      </div>
    );
  } else {
    if (name) {
      return (
        <div>
          A Google Calendar with the name '{name}' was not found in your Google
          Calendars! Don't worry, we'll create it for you!
        </div>
      );
    } else {
      return <div>Please enter a calendar name</div>;
    }
  }
};

function FirstSetupCalendar(props) {
  const { loading, error, data } = useQuery(GET_MY_CALENDARS, {
    fetchPolicy: "cache-and-network"
  });

  const [name, setName] = useState(null);
  const [isNextDisabled, setIsNextDisabled] = useState(true);

  const onChange = event => {
    const value = event.target.value;

    value ? setIsNextDisabled(false) : setIsNextDisabled(true);

    setName(event.target.value);
  };

  const onSubmit = event => {
    props.handleSetCalendar(name);
  };

  const selectCalendar = event => {
    const value = event.target.innerText;
    value ? setIsNextDisabled(false) : setIsNextDisabled(true);

    setName(value);
  };

  const clearCalendar = event => {
    setName(null);
  };

  const filterCalendars = calendars => {
    if (name) {
      return calendars
        .filter(calendar => {
          return calendar.summary.match(new RegExp(name, "ig"))
            ? calendar
            : null;
        })
        .map((calendar, i) => {
          return (
            <li key={i} onClick={selectCalendar}>
              {calendar.summary}
            </li>
          );
        });
    } else {
      return calendars.map((calendar, i) => {
        return (
          <li key={i} title={calendar.description} onClick={selectCalendar}>
            {calendar.summary}
          </li>
        );
      });
    }
  };

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
    const calendars = filterCalendars(getMyCalendars);

    return (
      <div>
        <h2>Select a Calendar</h2>
        <p>
          This is the Google Calendar that we will sync your task history to.
        </p>
        <CalendarNameInput
          value={name}
          onChange={onChange}
          setIsNextDisabled={setIsNextDisabled}
        />
        <button onClick={clearCalendar}>Clear</button>
        <CalendarList calendars={calendars} name={name} />
        {isNextDisabled ? null : (
          <Link to={props.nextPath} onClick={onSubmit}>
            Next
          </Link>
        )}
      </div>
    );
  }
}

FirstSetupCalendar.propTypes = {
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

export default FirstSetupCalendar;
