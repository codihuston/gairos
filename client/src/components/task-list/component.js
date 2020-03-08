import React from "react";
import PropTypes from "prop-types";
import { ListGroup } from "react-bootstrap";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCheck } from "@fortawesome/pro-duotone-svg-icons";

import TaskPropTypes from "../../prop-types/task";

function TaskList({ children, tasks }) {
  if (!tasks.length) return <div>Add a task above!</div>;
  return (
    <div>
      <h3>Your Tasks</h3>
      {children}
      <ListGroup>
        {tasks.map((task, i) => (
          <ListGroup.Item key={i}>
            <span
              title={task.description}
              style={{
                cursor: "pointer"
              }}
            >
              {task.name}
            </span>{" "}
            {task.isCreated ? <FontAwesomeIcon icon={faCheck} /> : null}
          </ListGroup.Item>
        ))}
      </ListGroup>
    </div>
  );
}

TaskList.propTypes = {
  children: PropTypes.arrayOf(PropTypes.object),
  tasks: PropTypes.arrayOf(TaskPropTypes)
};

export default TaskList;
