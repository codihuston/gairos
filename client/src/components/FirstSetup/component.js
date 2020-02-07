import React, { useState } from "react";
import PropTypes from "prop-types";
import { Switch, Route, Link, Redirect, useRouteMatch } from "react-router-dom";
import { useMutation } from "react-apollo";

import { APP_NAME } from "../../config";
import { component as SelectCalendar } from "../FirstSetupCalendar";
import { component as AddTaskForm } from "../FirstSetupTasks";
import { TaskList } from "../FirstSetupTasks";
import { createMyCalendar as CREATE_MY_CALENDAR } from "../FirstSetupCalendar/queries";
import { createMyTask as CREATE_MY_TASK } from "../FirstSetupTasks/queries";

function FirstSetupComponent() {
  const [calendar, setCalendar] = useState(null);
  const [tasks, setTasks] = useState([]);
  let match = useRouteMatch();
  const [createMyCalendar] = useMutation(CREATE_MY_CALENDAR);
  const [createMyTask] = useMutation(CREATE_MY_TASK);

  const handleSetCalendar = name => {
    setCalendar(name);
  };

  const handleAddTask = newTask => {
    // append the new task to existing tasks
    const temp = tasks.concat(newTask);

    // set the new list of tasks
    setTasks(temp);
  };

  const handleSubmit = async e => {
    e.preventDefault();

    // TODO: handle graphql errors?
    // TODO: show "complete" status?

    // create calendar
    const res = await createMyCalendar({
      variables: {
        summary: calendar,
        description: "FAKE DESCR"
      }
    });

    // create each task
    (async function() {
      for await (const task of tasks) {
        try {
          let taskRes = await createMyTask({
            variables: {
              name: task.name,
              description: task.description
            }
          });
          console.log(task.name, taskRes);
        } catch (e) {
          if (
            e.message &&
            e.message.toLowerCase().includes("already created this task")
          ) {
            // ignore it
            console.log("ignore this error", e);
          }
        }
      }
    })();
    // TODO: update user profile (isFirstSetupCompleted)

    console.log("RES", res);
  };

  return (
    <div>
      <div>
        {!calendar ? (
          <Redirect to={`${match.path}/create-calendar`} />
        ) : calendar && !tasks.length ? (
          <Redirect to={`${match.path}/create-tasks`} />
        ) : calendar && tasks.length ? (
          <Redirect to={`${match.path}/confirm`} />
        ) : null}
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
              nextPath={`${match.path}/create-tasks`}
            />
          </Route>
          <Route path={`${match.path}/create-tasks`}>
            <AddTaskForm
              tasks={tasks}
              handleAddTask={handleAddTask}
              nextPath={`${match.path}/confirm`}
            />
          </Route>
          <Route path={`${match.path}/confirm`}>
            <h1>Confirm Your Setup</h1>
            <div>
              <h3>Your Calendar</h3>
              <p>
                If this calendar exists in your Google Calendar, we will use it,
                otherwise we will create it.
              </p>
              {calendar}
            </div>
            <div>
              <h3>Your Tasks</h3>
              <p>
                These are your first tasks that we will create for you! You can
                always edit them or add more later.
              </p>
              <TaskList tasks={tasks} />
            </div>
            <button onClick={handleSubmit}>Submit</button>
          </Route>
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
