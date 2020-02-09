import React, { useState, useEffect } from "react";
import PropTypes from "prop-types";
import { Link } from "react-router-dom";

export const TaskList = ({ children, tasks }) => {
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
};

function FirstSetupTasks({ tasks, handleAddTask, nextPath }) {
  const [isAddDisabled, setIsAddDisabled] = useState(true);
  const [isNextDisabled, setIsNextDisabled] = useState(
    tasks.length ? false : true
  );
  const [newTask, setNewTask] = useState({
    name: "",
    description: "",
    isCreated: false
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
      description: "",
      isCreated: false
    });
    setIsAddDisabled(true);
  };

  const setNewTaskName = e => {
    const { value } = e.target;

    value ? setIsAddDisabled(false) : setIsAddDisabled(true);

    setNewTask(prev => ({
      name: value,
      description: prev.description,
      isCreated: prev.isCreated
    }));
  };

  const setNewTaskDescription = e => {
    const { value } = e.target;
    setNewTask(prev => ({
      name: prev.name,
      description: value,
      isCreated: prev.isCreated
    }));
  };

  return (
    <div>
      <h3>Create Your First Tasks</h3>
      <p>
        These are the tasks that you can choose to track. After you are finished
        tracking, this activity will be saved to your Google Calendar for
        viewing. You will also be able to report on your activity in your home
        and reports page!
      </p>
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
