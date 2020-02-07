import React, { useState } from "react";
import PropTypes from "prop-types";
import { Link } from "react-router-dom";

export const TaskList = ({ tasks }) => {
  if (!tasks.length) return <div>Add a task above!</div>;
  return (
    <div>
      <h3>Your Tasks</h3>
      {tasks.map((task, i) => (
        <li key={i}>{task.name}</li>
      ))}
    </div>
  );
};

function FirstSetupTasks({ tasks, handleAddTask, nextPath }) {
  const [isAddDisabled, setIsAddDisabled] = useState(true);
  const [isNextDisabled, setIsNextDisabled] = useState(true);
  const [newTask, setNewTask] = useState({
    name: "",
    description: ""
  });

  const addTask = e => {
    e.preventDefault();

    // append the new task to existing tasks
    const temp = tasks.concat(newTask);

    // set the new list of tasks
    handleAddTask(newTask);

    // enable next if there are tasks
    if (temp.length) {
      setIsNextDisabled(false);
    }

    // clear out the inputs
    clearForm();
  };

  const clearForm = () => {
    setNewTask({
      name: "",
      description: ""
    });
    setIsAddDisabled(true);
  };

  const setNewTaskName = e => {
    const { value } = e.target;

    value ? setIsAddDisabled(false) : setIsAddDisabled(true);

    setNewTask(prev => ({
      name: value,
      description: prev.description
    }));
  };

  const setNewTaskDescription = e => {
    const { value } = e.target;
    setNewTask(prev => ({
      name: prev.name,
      description: value
    }));
  };

  return (
    <div>
      <h3>Create Your First Tasks</h3>
      <form>
        <div>
          <label htmlFor="name">Name * </label>
          <input
            id="name"
            type="text"
            placeholder="Enter a task name"
            value={newTask.name}
            onChange={setNewTaskName}
          />
        </div>
        <div>
          <label htmlFor="description">Description</label>
          <input
            id="description"
            type="text"
            placeholder="Describe your task"
            value={newTask.description}
            onChange={setNewTaskDescription}
          />
        </div>
        <button onClick={addTask} disabled={isAddDisabled}>
          Add
        </button>
      </form>
      <TaskList tasks={tasks} />
      {isNextDisabled ? null : <Link to={nextPath}>Next</Link>}
    </div>
  );
}

FirstSetupTasks.propTypes = {
  isAddDisabled: PropTypes.bool,
  isNextDisabled: PropTypes.bool,
  tasks: PropTypes.arrayOf(
    PropTypes.shape({
      name: PropTypes.string,
      description: PropTypes.string
    })
  ),
  newTask: PropTypes.shape({
    name: PropTypes.string,
    description: PropTypes.string
  })
};

export default FirstSetupTasks;
