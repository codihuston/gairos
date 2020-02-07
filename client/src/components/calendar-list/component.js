import React from "react";

export default function CalendarList({ calendars, onClick }) {
  return (
    <div>
      {calendars.map((calendar, i) => (
        <li
          key={i}
          title={calendar.description}
          onClick={e => onClick(e, calendar)}
        >
          {calendar.summary}
        </li>
      ))}
    </div>
  );
}
