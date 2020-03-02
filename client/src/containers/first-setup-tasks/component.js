import React, { useState } from "react";
import PropTypes from "prop-types";
import { Link } from "react-router-dom";
import { Button, InputGroup, FormControl } from "react-bootstrap";

import { component as TaskList } from "../../components/task-list";

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
          <InputGroup className="mb-3">
            <InputGroup.Prepend>
              <InputGroup.Text id="">Name*</InputGroup.Text>
            </InputGroup.Prepend>
            <FormControl
              id="name"
              type="text"
              placeholder="Enter a task name"
              value={newTask.name}
              onChange={setNewTaskName}
            />
          </InputGroup>
          <InputGroup className="mb-3">
            <InputGroup.Prepend>
              <InputGroup.Text id="">Description</InputGroup.Text>
            </InputGroup.Prepend>
            <FormControl
              id="description"
              type="text"
              placeholder="Describe your task"
              value={newTask.description}
              onChange={setNewTaskDescription}
            />
          </InputGroup>
        </div>
        <Button variant="success" onClick={addTask} disabled={isAddDisabled}>
          Add
        </Button>
      </form>
      <TaskList tasks={tasks} />
      {isNextDisabled ? null : (
        <Button variant="info" className="mt-1">
          <Link
            to={nextPath}
            className="no-style"
            style={{
              textDecoration: "none",
              color: "white"
            }}
          >
            Next
          </Link>
        </Button>
      )}
    </div>
  );
}

FirstSetupTasks.propTypes = {
  isAddDisabled: PropTypes.bool,
  isNextDisabled: PropTypes.bool,
  handleAddTask: PropTypes.func,
  nextPath: PropTypes.string,
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
