import React, { useState, useRef } from "react";
import { Modal, Button, Alert, Form } from "react-bootstrap";
import { toast } from "react-toastify";

import { component as Loading } from "../loading";
import UpdateMyTask from "../../graphql/mutations/hooks/update-my-task";
import DeleteMyTask from "../../graphql/mutations/hooks/delete-my-task";
import { GET_MY_TASKS as query } from "../../graphql/queries";

export default ({ show, handleClose, task }) => {
  const [remove, { loading: isDeleteLoading }] = DeleteMyTask();
  const [update, { loading: isUpdateLoading }] = UpdateMyTask();
  const shouldDeleteInput = useRef(null);
  const [error, setError] = useState(null);

  const loading = isDeleteLoading || isUpdateLoading;

  if (!task) {
    return null;
  }

  const handleSubmit = async () => {
    setError("");

    try {
      // delete the task
      if (shouldDeleteInput.current.checked) {
        await remove({
          variables: {
            userTaskId: task.userTaskInfo.id
          },
          refetchQueries: [
            {
              query
            }
          ]
        });

        toast.success("Task Permanently Deleted!");
      }
      // archive the task
      else {
        await update({
          variables: {
            userTaskId: task.userTaskInfo.id,
            isArchived: true
          },
          refetchQueries: [{ query }]
        });
      }

      return handleClose();
    } catch (e) {
      setError(e.message);
    }
  };

  return (
    <Modal show={show} onHide={handleClose} animation={false}>
      <Modal.Header closeButton>
        <Modal.Title>Delete A Task</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <p>Are you sure you want to delete '{task.name}'?</p>
        <p>
          This action will archive this task so that your history with this task
          remains intact. This will NOT destroy any recorded history of this
          task. If you want to completely remove all traces of this task in your
          history, check the checkbox option below.
        </p>
        <Alert variant="info">
          If you opt to permanently delete this task, any recorded task history
          will be deleted from our database, and WILL NOT be deleted from your
          Google Calendar!
        </Alert>
        <div className="m-3">
          <Form.Group controlId="formBasicCheckbox">
            <Form.Check
              type="checkbox"
              label="Permanently delete this task and its task history"
              defaultChecked={false}
              ref={shouldDeleteInput}
            />
          </Form.Group>
        </div>
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
};
