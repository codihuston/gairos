import React from "react";
import { ListGroup } from "react-bootstrap";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCheck } from "@fortawesome/pro-duotone-svg-icons";

export default function TaskList({ children, tasks }) {
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
