import React from "react";
import PropTypes from "prop-types";

function Dropdown({
  isVisible,
  options,
  displayMember,
  query,
  handleSelect,
  handleBlur
}) {
  const handleClick = (e, data) => {
    handleSelect(e, data);
    // hide this dropdown after select
    handleBlur();
  };

  if (!options.length) return <div>&ldquo;{query}&rdquo; not found!</div>;
  if (isVisible) {
    return (
      <div
        style={{
          position: "absolute",
          background: "white",
          width: "100%",
          border: "1px solid black",
          maxHeight: "25vh",
          overflowY: "auto"
        }}
      >
        {options.map((option, i) => (
          <ul
            key={i}
            onClick={e => handleClick(e, option)}
            style={{
              cursor: "pointer"
            }}
          >
            {option[displayMember]}
          </ul>
        ))}
        <ul
          onClick={handleBlur}
          style={{
            cursor: "pointer"
          }}
        >
          Click to close...
        </ul>
      </div>
    );
  }
  return null;
}

Dropdown.propTypes = {
  isVisible: PropTypes.bool,
  options: PropTypes.arrayOf(PropTypes.object),
  displayMember: PropTypes.string,
  query: PropTypes.string,
  handleSelect: PropTypes.func,
  handleBlur: PropTypes.func
};

export default Dropdown;
