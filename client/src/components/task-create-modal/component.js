import React, { useState, Fragment } from "react";
import { Modal, Button, Alert, Form, Container, Row } from "react-bootstrap";
import { toast } from "react-toastify";
import PropTypes from "prop-types";

import { component as Loading } from "../loading";
import CreateMyTask from "../../graphql/mutations/hooks/create-my-task";
import { GET_MY_TASKS as query } from "../../graphql/queries";

function TaskCreateModal({ show, handleClose }) {
  const [mutate, { loading }] = CreateMyTask();
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [error, setError] = useState(null);

  const handleSubmit = async () => {
    setError(null);

    try {
      await mutate({
        variables: {
          name,
          description
        },
        refetchQueries: [
          {
            query
          }
        ]
      });

      toast.success("Task Created!");

      setName("");
      setDescription("");

      return handleClose();
    } catch (e) {
      setError(e.message);
    }
  };

  const handleChangeName = e => {
    setName(e.target.value);
  };

  const handleChangeDescription = e => {
    setDescription(e.target.value);
  };

  return (
    <Modal show={show} onHide={handleClose} animation={false}>
      <Modal.Header closeButton>
        <Modal.Title>Create A Task</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <Form>
          <Form.Group controlId="formTaskName">
            <Form.Label>Name</Form.Label>
            <Form.Control
              type="text"
              placeholder="Name your task"
              value={name}
              onChange={handleChangeName}
            />
          </Form.Group>

          <Form.Group controlId="formTaskDescription">
            <Form.Label>Description</Form.Label>
            <Form.Control
              type="text"
              placeholder="Describe your task"
              value={description}
              onChange={handleChangeDescription}
            />
            {error ? (
              <Alert variant="danger" className="mt-1">
                {error}
              </Alert>
            ) : null}
          </Form.Group>
          <Container fluid className="mt-1">
            <Row className="justify-content-end">
              {loading ? (
                <Loading />
              ) : (
                <Fragment>
                  <Button
                    variant="primary"
                    onClick={handleSubmit}
                    className="mr-1"
                    style={{
                      visibility: loading ? "hidden" : "visible"
                    }}
                  >
                    Create
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
                </Fragment>
              )}
            </Row>
          </Container>
        </Form>
      </Modal.Body>
    </Modal>
  );
}

TaskCreateModal.propTypes = {
  show: PropTypes.bool,
  handleClose: PropTypes.func
};

export default TaskCreateModal;
