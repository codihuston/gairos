import React, { useState, useEffect } from "react";
import { useQuery } from "react-apollo";

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
    setSummary(e.target.value);
  };

  const onClick = e => {
    setSummary(e.target.innerText);
    props.onClick(e);
  };

  const filteredList = getMyCalendars.filter(item =>
    item.summary.match(new RegExp(summary, "ig"))
  );

  return (
    <div>
      <CalendarNameInput value={summary} onChange={onChange} />
      <CalendarList calendars={filteredList} onClick={onClick} />
    </div>
  );
}
