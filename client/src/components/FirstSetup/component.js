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
  const [calendar, setCalendar] = useState({
    summary: "",
    isCreated: false
  });
  const [tasks, setTasks] = useState([]);
  let match = useRouteMatch();
  const [createMyCalendar] = useMutation(CREATE_MY_CALENDAR);
  const [createMyTask] = useMutation(CREATE_MY_TASK);

  const handleSetCalendar = summary => {
    setCalendar({
      summary,
      isCreated: false
    });
  };

  const handleAddTask = newTask => {
    // append the new task to existing tasks
    const temp = tasks.concat(newTask);

    // set the new list of tasks
    setTasks(temp);
  };

  const handleSubmit = async e => {
    e.preventDefault();

    // variables that will replace repsective states
    const newTasks = [];
    const newCalendar = Object.assign({}, calendar);

    // create calendar
    // TODO: how to handle calendar creation failure?
    const res = await createMyCalendar({
      variables: {
        summary: calendar.summary,
        description: "FAKE DESCR"
      }
    });

    // update calendar in state
    newCalendar.isCreated = true;
    setCalendar(newCalendar);

    // execute the creation of these tasks (async) in order
    await tasks.reduce(
      (p, task) =>
        // whe a promise resolves, chain onto it
        p.then(async () => {
          try {
            // create the task
            await createMyTask({
              variables: {
                name: task.name,
                description: task.description
              }
            });

            // update prop on this task
            task.isCreated = true;
          } catch (e) {
            const doesTaskAlreadyExist =
              e.message &&
              e.message.toLowerCase().includes("already created this task");
            if (doesTaskAlreadyExist) {
              // set the task as created anyways
              task.isCreated = true;
            } else {
              // TODO: handle error?
            }
          }
          // push this newly created task onto our array
          newTasks.push(task);
        }),
      // the initial promise to kick off this loop
      Promise.resolve(null)
    );

    // update the tasks in state, so they re-render
    setTasks(newTasks);

    // TODO: update user profile, since calendarId and isFirstSetupCompleted
    // should be updated!

    console.log("RES", res);
  };

  return (
    <div>
      <div>
        {!calendar.summary ? (
          <Redirect to={`${match.path}/create-calendar`} />
        ) : calendar.summary && !tasks.length ? (
          <Redirect to={`${match.path}/create-tasks`} />
        ) : calendar.summary && tasks.length ? (
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
              {calendar.summary}
              {calendar.isCreated ? "Created!" : null}
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
