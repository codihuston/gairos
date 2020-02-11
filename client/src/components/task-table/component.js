import React from "react";
import { Table } from "react-bootstrap";

import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faEdit, faTrash } from "@fortawesome/pro-duotone-svg-icons";

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

export default function TaskTable({ tasks }) {
  if (!tasks.length) return <div>No Tasks Provided!</div>;
  return (
    <div>
      <h2>Your Tasks</h2>
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
