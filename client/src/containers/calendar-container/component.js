import React, { useState, useEffect } from "react";
import { useQuery } from "react-apollo";
import escapeStringRegexp from "escape-string-regexp";

import { GET_MY_CALENDARS } from "../../graphql/queries";
import { component as CalendarList } from "../../components/calendar-list";
import { component as Loading } from "../../components/LoadingComponent";

export const CalendarNameInput = ({ onChange, value }) => {
  return (
    <div>
      <label htmlFor="name">Select a Calendar:</label>
      <input
        id="summary"
        type="text"
        onChange={onChange}
        placeholder="Enter a calendar name"
        value={value}
      ></input>
    </div>
  );
};

const filterByName = calendars => {};

export default function CalendarContainer(props) {
  const { error, loading, data } = useQuery(GET_MY_CALENDARS);
  const [summary, setSummary] = useState("");

  // TODO: handle error
  if (loading) return <Loading />;
  const { getMyCalendars } = data;

  const onChange = e => {
    // update state
    setSummary(e.target.value);

    // look for exact match (case insensitive)
    const filter = getMyCalendars.filter(
      item => item.summary.toLowerCase() === summary.toLowerCase()
    );

    // return it, if found
    if (filter && filter[0]) {
      props.onClick(filter[0]);
    }
    // return a minimal calenendar obj (for first-setup)
    else {
      props.onClick({
        summary: e.target.value
      });
    }
  };

  const onClick = (e, data) => {
    setSummary(e.target.innerText);
    props.onClick(data);
  };

  const filteredList = getMyCalendars.filter(item =>
    item.summary.match(new RegExp(escapeStringRegexp(summary), "ig"))
  );

  // TODO: make this a HOC; able to pass in custom children
  return (
    <div>
      <CalendarNameInput value={summary} onChange={onChange} />
      <CalendarList calendars={filteredList} onClick={onClick} />
    </div>
  );
}
