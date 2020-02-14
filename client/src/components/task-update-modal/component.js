import React, { useState, useRef } from "react";
import { Modal, Button, Alert, Form, Container, Row } from "react-bootstrap";
import { toast } from "react-toastify";
import { merge } from "lodash";

import { component as Loading } from "../loading";
import RenameMyTask from "../../graphql/mutations/hooks/rename-my-task";
import UpdateMyTask from "../../graphql/mutations/hooks/update-my-task";
import { GET_MY_TASKS as query } from "../../graphql/queries";

/**
 * Uses uncontrolled inputs in order to use default values
 */
export default ({ show, handleClose, task }) => {
  const [mutate, { data: updateData, loading: updateLoading }] = UpdateMyTask();
  const [rename, { data: renameData, loading: renameLoading }] = RenameMyTask();
  const [error, setError] = useState("");

  const loading = updateLoading || renameLoading;
  const data = merge(updateData, renameData);

  const nameInput = useRef(null);
  const descriptionInput = useRef(null);

  if (!task) {
    return null;
  }

  const handleSubmit = async () => {
    setError("");

    try {
      // rename the user's task if it has changed
      if (nameInput.current.value !== task.name) {
        await rename({
          variables: {
            userTaskId: task.userTaskInfo.id,
            name: nameInput.current.value
          },
          refetchQueries: [{ query }]
        });
      }
      // update the user task properties
      await mutate({
        variables: {
          userTaskId: task.userTaskInfo.id,
          description: descriptionInput.current.value
        },
        refetchQueries: [
          {
            query
          }
        ]
      });

      toast.success("Task Updated!");

      return handleClose();
    } catch (e) {
      setError(e.message);
    }
  };

  return (
    <Modal show={show} onHide={handleClose} animation={false}>
      <Modal.Header closeButton>
        <Modal.Title>Edit {task && task.name ? task.name : "Task"}</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <Form>
          <Form.Group controlId="formTaskName">
            <Form.Label>Name</Form.Label>
            <Form.Control
              type="text"
              placeholder="Name your task"
              defaultValue={task.name}
              ref={nameInput}
            />
          </Form.Group>

          <Form.Group controlId="formTaskDescription">
            <Form.Label>Description</Form.Label>
            <Form.Control
              type="text"
              placeholder="Describe your task"
              defaultValue={task.userTaskInfo.description}
              ref={descriptionInput}
            />
            {error ? (
              <Alert variant="danger" className="mt-1">
                {error}
              </Alert>
            ) : null}
          </Form.Group>
          <Container fluid className="mt-1">
            <Row className="justify-content-end">
              {loading ? <Loading /> : null}
              <Button
                variant="primary"
                onClick={handleSubmit}
                style={{
                  visibility: loading ? "hidden" : "visible"
                }}
              >
                Update
              </Button>
              <Button
                variant="secondary"
                onClick={handleClose}
                style={{
                  visibility: loading ? "hidden" : "visible"
                }}
              >
                Cancel
              </Button>
            </Row>
          </Container>
        </Form>
      </Modal.Body>
    </Modal>
  );
};
