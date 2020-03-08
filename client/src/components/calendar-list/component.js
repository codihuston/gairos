import React from "react";
import PropTypes from "prop-types";
import { ListGroup } from "react-bootstrap";

function CalendarList({ calendars, onClick }) {
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

CalendarList.propTypes = {
  calendars: PropTypes.arrayOf(
    PropTypes.shape({
      summary: PropTypes.string,
      description: PropTypes.string
    })
  ),
  onClick: PropTypes.func
};

export default CalendarList;
