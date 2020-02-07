import React from "react";

export default function CalendarList({ calendars, onClick }) {
  return (
    <div>
      {calendars.map(calendar => (
        <li
          key={calendar.summary}
          title={calendar.description}
          onClick={onClick}
        >
          {calendar.summary}
        </li>
      ))}
    </div>
  );
}
