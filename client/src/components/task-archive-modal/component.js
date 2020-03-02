import React, { useState } from "react";
import PropTypes from "prop-types";
import TaskPropTypes from "../../prop-types/task";
import { Modal, Button, Alert } from "react-bootstrap";

import UpdateMyTask from "../../graphql/mutations/hooks/update-my-task";
import { GET_MY_TASKS as query } from "../../graphql/queries";

function TaskArchiveList({ show, handleClose, tasks }) {
  const [mutate] = UpdateMyTask();
  const [error, setError] = useState(null);

  const handleClick = async (e, task) => {
    setError(null);
    try {
      // update the user task properties
      await mutate({
        variables: {
          userTaskId: task.userTaskInfo.id,
          isArchived: false
        },
        refetchQueries: [
          {
            query
          }
        ]
      });
    } catch (e) {
      setError(e.message);
    }
  };

  return (
    <Modal show={show} onHide={handleClose} animation={false}>
      <Modal.Header closeButton>
        <Modal.Title>Archived Tasks</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <ul>
          {tasks.length
            ? tasks.map(task => (
                <li
                  key={task.userTaskInfo.id}
                  title={task.userTaskInfo.description}
                  className="d-flex justify-content-between mb-3"
                >
                  <div>{task.name}</div>
                  <Button variant="primary" onClick={e => handleClick(e, task)}>
                    Restore from Archive
                  </Button>
                </li>
              ))
            : "You have no archived tasks!"}
        </ul>
        {<Alert variant="danger">error</Alert> ? error : null}
      </Modal.Body>
    </Modal>
  );
}

TaskArchiveList.propTypes = {
  show: PropTypes.bool,
  handleClose: PropTypes.func,
  tasks: PropTypes.arrayOf(TaskPropTypes)
};

export default TaskArchiveList;
