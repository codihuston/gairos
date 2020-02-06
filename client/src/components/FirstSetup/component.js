import React, { useState } from "react";
import PropTypes from "prop-types";
import { Switch, Route, Link, Redirect, useRouteMatch } from "react-router-dom";

import { APP_NAME } from "../../config";
import { component as SelectCalendar } from "../SelectCalendar";
import { component as AddTaskForm } from "../FirstSetupTasks";

function FirstSetupComponent() {
  const [calendar, setCalendar] = useState(null);
  const [tasks, setTasks] = useState([]);

  let match = useRouteMatch();

  const handleSetCalendar = name => {
    setCalendar(name);
  };

  const handleAddTask = newTask => {
    // append the new task to existing tasks
    const temp = tasks.concat(newTask);

    // set the new list of tasks
    setTasks(temp);
  };

  return (
    <div>
      <div>Calendar is: {calendar}</div>
      <div>
        <Switch>
          <Route path={`${match.path}/start`}>
            <h2>Welcome to {APP_NAME}!</h2>
            <p>
              It is time to set up your profile! This setup will walk you
              through the following:
            </p>
            <ol>
              <li>
                Configuring your Google Calendar: when you track your tasks,
                they will appear in your calendar!
              </li>
              <li>
                Creating your first task: we will record your task history so
                that we can show you how you manage your time! All of your tasks
                will be recorded to your Google Calendar
              </li>
            </ol>
            <p>So, what are you waiting for? Let's get started!</p>
            <Link to={`${match.path}/create-calendar`}>Okay!</Link>
          </Route>
          <Route path={`${match.path}/create-calendar`}>
            <SelectCalendar
              handleSetCalendar={handleSetCalendar}
              nextPath={`${match.path}/create-task`}
            />
          </Route>
          <Route path={`${match.path}/create-task`}>
            <div>
              <AddTaskForm
                tasks={tasks}
                handleAddTask={handleAddTask}
                nextPath={`${match.path}/confirm`}
              />
            </div>
          </Route>
          <Route path={`${match.path}/confirm`}>Confirm</Route>
          <Route path={`${match.path}`}>
            <Redirect to={`${match.path}/start`} />
          </Route>
        </Switch>
      </div>
    </div>
  );
}

FirstSetupComponent.propTypes = {
  calendar: PropTypes.string,
  data: PropTypes.shape({
    loading: PropTypes.bool,
    getMyCalendars: PropTypes.arrayOf(
      PropTypes.shape({
        id: PropTypes.string,
        summary: PropTypes.string,
        description: PropTypes.string
      })
    ),
    error: PropTypes.object
  })
};

export default FirstSetupComponent;
