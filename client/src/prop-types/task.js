import PropTypes from "prop-types";

export default PropTypes.shape({
  id: PropTypes.string,
  name: PropTypes.string,
  createdAt: PropTypes.string,
  updatedAt: PropTypes.string,
  userTaskInfo: PropTypes.shape({
    id: PropTypes.string,
    description: PropTypes.string,
    isPublic: PropTypes.bool,
    isArchived: PropTypes.bool,
    createdAt: PropTypes.string,
    updatedAt: PropTypes.string
  })
});
