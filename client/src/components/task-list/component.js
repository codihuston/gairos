import React from "react";

export default function TaskList({ children, tasks }) {
  if (!tasks.length) return <div>Add a task above!</div>;
  return (
    <div>
      <h3>Your Tasks</h3>
      {children}
      {tasks.map((task, i) => (
        <li key={i}>
          {task.name} {task.isCreated ? "Created!" : null}
        </li>
      ))}
    </div>
  );
}
