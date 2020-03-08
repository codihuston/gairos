import React, { useState } from "react";
import PropTypes from "prop-types";
import { Modal, Button, Alert } from "react-bootstrap";
import { toast } from "react-toastify";
import moment from "moment";

import TaskHistoryPropTypes from "../../prop-types/task-history";
import { component as Loading } from "../loading";
import DeleteMyTaskHistory from "../../graphql/mutations/hooks/delete-my-task-history";
import { GET_MY_TASK_HISTORY as query } from "../../graphql/queries";

function TaskHistoryDeleteModal({ show, handleClose, taskHistory }) {
  const [remove, { loading }] = DeleteMyTaskHistory();
  const [error, setError] = useState(null);

  if (!taskHistory) {
    return null;
  }

  const handleSubmit = async () => {
    setError("");

    try {
      await remove({
        variables: {
          id: taskHistory.id
        },
        refetchQueries: [
          {
            query
          }
        ]
      });

      toast.success("Task History Permanently Deleted!");

      return handleClose();
    } catch (e) {
      setError(e.message);
    }
  };

  return (
    <Modal show={show} onHide={handleClose} animation={false}>
      <Modal.Header closeButton>
        <Modal.Title>Delete A Task History</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <p>Are you sure you want to delete this task history?</p>
        <p>
          This action will completely delete this task history instance starting
          from:
        </p>
        <div>
          {taskHistory && taskHistory.startTime && taskHistory.endTime ? (
            <>
              <div>
                {new moment(taskHistory.startTime).format("LL hh:mm:ss A")}
              </div>
              <div>to</div>
              <div>
                {new moment(taskHistory.endTime).format("LL hh:mm:ss A")}
              </div>
            </>
          ) : null}
        </div>
        <Alert variant="info">
          If you choose to delete this, it will also be removed from your Google
          Calendar!
        </Alert>
        {error ? (
          <Alert variant="danger" className="mt-1">
            {error}
          </Alert>
        ) : null}
      </Modal.Body>
      <Modal.Footer>
        {loading ? <Loading /> : null}
        <Button onClick={handleSubmit}>Yes</Button>
        <Button variant="secondary" onClick={handleClose}>
          Cancel
        </Button>
      </Modal.Footer>
    </Modal>
  );
}

TaskHistoryDeleteModal.propTypes = {
  show: PropTypes.bool,
  handleClose: PropTypes.func,
  taskHistory: TaskHistoryPropTypes
};

export default TaskHistoryDeleteModal;
