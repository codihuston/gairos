import React from "react";
import { ListGroup } from "react-bootstrap";

export default function CalendarList({ calendars, onClick }) {
  return (
    <ListGroup
      style={{
        position: "absolute",
        width: "100%"
      }}
    >
      {calendars.map((calendar, i) => (
        <ListGroup.Item
          key={i}
          title={calendar.description}
          onClick={e => onClick(e, calendar)}
          style={{
            cursor: "pointer"
          }}
        >
          {calendar.summary}
        </ListGroup.Item>
      ))}
    </ListGroup>
  );
}
