import PropTypes from "prop-types";

import TaskPropTypes from "./task";

export default PropTypes.shape({
  id: PropTypes.string,
  description: PropTypes.string,
  task: TaskPropTypes
});
