import React, { useState, useRef, Fragment, useEffect } from "react";
import { Modal, Button, Alert, Form, Container, Row } from "react-bootstrap";
import { toast } from "react-toastify";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";

import { component as Loading } from "../loading";
import UpdateTaskHistory from "../../graphql/mutations/hooks/update-my-task-history";
import { GET_MY_TASK_HISTORY as query } from "../../graphql/queries";

/**
 * Uses uncontrolled inputs in order to use default values
 */
export default ({ show, handleClose, taskHistory }) => {
  const [mutate, { loading }] = UpdateTaskHistory();
  const [startTime, setStartDate] = useState(new Date());
  const [endTime, setEndDate] = useState(new Date());
  const [error, setError] = useState("");
  console.log("INIT", taskHistory && taskHistory.startTime, startTime);

  useEffect(() => {
    setStartDate(
      taskHistory && taskHistory.startTime
        ? new Date(taskHistory.startTime)
        : null
    );
    setEndDate(
      taskHistory && taskHistory.endTime ? new Date(taskHistory.endTime) : null
    );
  }, [taskHistory]);

  if (!taskHistory) {
    return null;
  }

  const handleSubmit = async () => {
    setError("");

    try {
      if (!startTime || !endTime) {
        throw new Error("The start and end times must be provided!");
      }

      const isStartTimeBeforeEndTime = startTime <= endTime;
      if (isStartTimeBeforeEndTime) {
        // update the user task properties
        await mutate({
          variables: {
            id: taskHistory.id,
            userTaskId: taskHistory.userTaskInfo.id,
            startTime,
            endTime,
            eventColorId: "1"
          },
          refetchQueries: [
            {
              query
            }
          ]
        });

        toast.success("Task History Updated!");

        return handleClose();
      } else {
        throw new Error("The start time must come before the end time!");
      }
    } catch (e) {
      setError(e.message);
    }
  };

  return (
    <Modal show={show} onHide={handleClose} animation={false}>
      <Modal.Header closeButton>
        <Modal.Title>Edit A Task History</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <p>
          {taskHistory && taskHistory.userTaskInfo.task.name
            ? `You are editing the task history for task "${taskHistory.userTaskInfo.task.name}"`
            : null}
        </p>
        <Form>
          <Form.Group controlId="formTaskName">
            <Form.Label>Name</Form.Label>
            <Form.Control
              type="text"
              placeholder="Name your task"
              defaultValue={taskHistory.userTaskInfo.task.name}
              disabled
              title="You cannot change tasks for an instance in history yet. This will be a feature in the future."
            />
          </Form.Group>
          <Form.Group controlId="formTaskDescription">
            <Form.Label>Description</Form.Label>
            <Form.Control
              type="text"
              placeholder="Describe your task"
              defaultValue={taskHistory.userTaskInfo.description}
              disabled
              title="You cannot edit this here. Visit the 'Tasks' page to change this description"
            />
          </Form.Group>
          <Form.Group controlId="formTaskHistoryStartTime">
            <Form.Label>Start Time</Form.Label>
            <Form.Control
              as={DatePicker}
              selected={startTime}
              onChange={date => setStartDate(date)}
              showTimeSelect
              timeFormat="hh:mm aa"
              timeIntervals={1}
              timeCaption="time"
              dateFormat="MMMM d, yyyy hh:mm aa"
            />
          </Form.Group>
          <Form.Group controlId="formTaskHistoryEndTime">
            <Form.Label>End Time</Form.Label>
            <Form.Control
              as={DatePicker}
              selected={endTime}
              onChange={date => setEndDate(date)}
              showTimeSelect
              timeFormat="hh:mm aa"
              timeIntervals={1}
              timeCaption="time"
              dateFormat="MMMM d, yyyy hh:mm aa"
            />
          </Form.Group>
          {error ? (
            <Alert variant="danger" className="mt-1">
              {error}
            </Alert>
          ) : null}
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
                </Fragment>
              )}
            </Row>
          </Container>
        </Form>
      </Modal.Body>
    </Modal>
  );
};
