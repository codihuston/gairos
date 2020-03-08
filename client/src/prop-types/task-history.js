import PropTypes from "prop-types";

import UserTaskInfoPropTypes from "./user-task-info";

export default PropTypes.shape({
  id: PropTypes.string,
  startTime: PropTypes.string,
  endTime: PropTypes.string,
  userTaskInfo: UserTaskInfoPropTypes
});
