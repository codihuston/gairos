import React, { useState } from "react";
import { Container, Row, Table, Modal, Form, Button } from "react-bootstrap";

import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faEdit, faTrash } from "@fortawesome/pro-duotone-svg-icons";
import { faPlus } from "@fortawesome/pro-light-svg-icons";

export const TaskTableRow = ({ task }) => {
  return (
    <tr>
      <td>{task.name}</td>
      <td>{task.description ? task.description : <i>None</i>}</td>
      <td>
        <button alt="edit button">
          <FontAwesomeIcon icon={faEdit} />
        </button>
        <button alt="delete button">
          <FontAwesomeIcon icon={faTrash} />
        </button>
      </td>
    </tr>
  );
};

export const CreateTaskModal = ({ show, handleClose, handleShow }) => {
  return (
    <Modal show={show} onHide={handleClose} animation={false}>
      <Modal.Header closeButton>
        <Modal.Title>Create A Task</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <Form>
          <Form.Group controlId="formTaskName">
            <Form.Label>Name</Form.Label>
            <Form.Control type="text" placeholder="Name your task" />
          </Form.Group>

          <Form.Group controlId="formTaskDescription">
            <Form.Label>Description</Form.Label>
            <Form.Control type="text" placeholder="Describe your task" />
          </Form.Group>
          <Container fluid>
            <Row className="justify-content-end">
              <Button variant="primary mr-1" onClick={handleClose}>
                Create
              </Button>
              <Button variant="secondary" onClick={handleClose}>
                Cancel
              </Button>
            </Row>
          </Container>
        </Form>
      </Modal.Body>
    </Modal>
  );
};

export default function TaskTable({ tasks }) {
  const [show, setShow] = useState(false);

  const handleClose = () => setShow(false);
  const handleShow = () => setShow(true);

  if (!tasks.length) return <div>No Tasks Provided!</div>;
  return (
    <div>
      <h2>Your Tasks</h2>
      <Button variant="primary" onClick={handleShow}>
        <FontAwesomeIcon icon={faPlus} />
        &nbsp;Create
      </Button>
      <CreateTaskModal show={show} handleClose={handleClose} />
      <Table striped bordered hover size="sm">
        <thead>
          <tr>
            <th>Name</th>
            <th>Description</th>
            <th>Info</th>
          </tr>
        </thead>
        <tbody>
          {tasks.map(task => (
            <TaskTableRow key={task.id} task={task} />
          ))}
        </tbody>
      </Table>
    </div>
  );
}
