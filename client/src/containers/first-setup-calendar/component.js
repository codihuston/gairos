import React, { useState } from "react";
import PropTypes from "prop-types";
import { useQuery } from "react-apollo";
import escapeStringRegexp from "escape-string-regexp";
import { InputGroup, FormControl } from "react-bootstrap";

import { APP_NAME } from "../../config";
import { GET_MY_CALENDARS } from "../../graphql/queries";
import { component as CalendarList } from "../../components/calendar-list";
import { component as Loading } from "../../components/loading";

const CalendarNameInput = ({
  onChange,
  value,
  filteredList,
  handleClick,
  handleFocus,
  handleBlur, // eslint-disable-line
  showDropdown
}) => {
  return (
    <div>
      <InputGroup className="mb-3">
        <label>Enter a Google Calendar</label>
        <div
          style={{
            position: "relative",
            width: "100%"
          }}
        >
          <FormControl
            id="summary"
            type="text"
            onChange={onChange}
            placeholder="Your Google Calendar"
            value={value}
            onFocus={handleFocus}
            // onBlur={handleBlur}
            autoComplete="off"
          ></FormControl>
          {showDropdown ? (
            <CalendarList calendars={filteredList} onClick={handleClick} />
          ) : null}
        </div>
      </InputGroup>
    </div>
  );
};

function CalendarContainer({ onClick = () => {} }) {
  const { error, loading, data } = useQuery(GET_MY_CALENDARS);
  const [summary, setSummary] = useState("");
  const [showDropdown, setShowDropdown] = useState(false);

  const handleFocus = () => {
    setShowDropdown(true);
  };

  const handleBlur = () => {
    setShowDropdown(false);
  };

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
    handleBlur();
  };

  const filteredList = getMyCalendars.filter(item =>
    item.summary.match(new RegExp(escapeStringRegexp(summary), "ig"))
  );

  // TODO: make this a HOC; able to pass in custom children
  return (
    <div>
      <CalendarNameInput
        value={summary}
        onChange={handleChange}
        filteredList={filteredList}
        handleClick={handleClick}
        handleFocus={handleFocus}
        handleBlur={handleBlur}
        showDropdown={showDropdown}
      />
      <p>
        Please choose an existing Google Calendar that {APP_NAME} will use to
        record your tasks into. If you want us to create a brand new calendar,
        simply let us know what you want to name the calendar by typing it in
        above!
      </p>
    </div>
  );
}

CalendarContainer.propTypes = {
  onClick: PropTypes.func
};

CalendarNameInput.propTypes = {
  value: PropTypes.string,
  onChange: PropTypes.func,
  handleClick: PropTypes.func,
  handleFocus: PropTypes.func,
  handleBlur: PropTypes.func,
  showDropdown: PropTypes.bool,
  filteredList: PropTypes.arrayOf(
    PropTypes.shape({
      summary: PropTypes.string,
      description: PropTypes.string
    })
  )
};

export { CalendarNameInput };
export default CalendarContainer;
