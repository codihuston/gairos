import React, { useState } from "react";
import { useQuery } from "react-apollo";
import escapeStringRegexp from "escape-string-regexp";

import { GET_MY_CALENDARS } from "../../graphql/queries";
import { component as CalendarList } from "../../components/calendar-list";
import { component as Loading } from "../../components/loading";

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

export default function CalendarContainer({ onClick = () => {} }) {
  const { error, loading, data } = useQuery(GET_MY_CALENDARS);
  const [summary, setSummary] = useState("");

  // TODO: handle error
  if (loading) return <Loading />;
  if (error) {
    return <div>Error: {error.message}</div>;
  }

  const { getMyCalendars } = data;

  const handleChange = e => {
    // update state
    setSummary(e.target.value);

    // look for exact match
    const filter = getMyCalendars.filter(
      item => item.summary === e.target.value
    );

    // return it, if found
    if (filter && filter[0]) {
      onClick(filter[0]);
    }
    // return a minimal calenendar obj (for first-setup)
    else {
      onClick({
        summary: e.target.value
      });
    }
  };

  const handleClick = (e, data) => {
    setSummary(e.target.innerText);
    onClick(data);
  };

  const filteredList = getMyCalendars.filter(item =>
    item.summary.match(new RegExp(escapeStringRegexp(summary), "ig"))
  );

  // TODO: make this a HOC; able to pass in custom children
  return (
    <div>
      <CalendarNameInput value={summary} onChange={handleChange} />
      <CalendarList calendars={filteredList} onClick={handleClick} />
    </div>
  );
}
