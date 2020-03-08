import React, { useState } from "react";
import PropTypes from "prop-types";
import TaskPropTypes from "../../prop-types/task";
import { Form } from "react-bootstrap";

import { component as Dropdown } from "../select-text-dropdown";

function SelectText({ placeholder, options, displayMember, handleSelect }) {
  const [query, setQuery] = useState("");
  const [isVisible, setIsVisible] = useState(false);

  const handleChange = e => {
    setQuery(e.target.value);
  };

  const handleFocus = () => {
    setIsVisible(true);
  };

  const handleBlur = () => {
    setIsVisible(false);
  };

  // no options are given
  if (!options.length) {
    console.warn(
      "No options given to select component. Nothing will be rendered!"
    );
    return null;
  }

  const filteredOptions = options.filter(
    option =>
      option[displayMember] &&
      option[displayMember].toLowerCase().includes(query)
  );

  return (
    <div>
      <h3>Track Your Tasks</h3>
      <Form
        style={{
          position: "relative"
        }}
      >
        <Form.Group>
          <Form.Label></Form.Label>
          <Form.Control
            type="text"
            placeholder={placeholder}
            value={query}
            onChange={handleChange}
            onFocus={handleFocus}
          ></Form.Control>
        </Form.Group>
        <Dropdown
          options={filteredOptions}
          displayMember="name"
          isVisible={isVisible}
          query={query}
          handleSelect={handleSelect}
          handleBlur={handleBlur}
        ></Dropdown>
      </Form>
    </div>
  );
}

SelectText.propTypes = {
  placeholder: PropTypes.string,
  options: PropTypes.arrayOf(TaskPropTypes),
  displayMember: PropTypes.string,
  handleSelect: PropTypes.func
};

export default SelectText;
