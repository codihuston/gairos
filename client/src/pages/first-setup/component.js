import React, { useState } from "react";
import PropTypes from "prop-types";
import { Switch, Route, Link, Redirect, useRouteMatch } from "react-router-dom";
import { useMutation } from "react-apollo";
import { Button, ListGroup } from "react-bootstrap";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCheck } from "@fortawesome/pro-duotone-svg-icons";

import { APP_NAME } from "../../config";
import GetUser from "../../graphql/queries/hooks/get-user";
import { component as CalendarContainer } from "../../containers/first-setup-calendar";
import { component as AddTaskForm } from "../../containers/first-setup-tasks";
import { component as TaskList } from "../../components/task-list";
import { CREATE_MY_CALENDAR } from "../../graphql/mutations";
import { CREATE_MY_TASK } from "../../graphql/mutations";
import { UPDATE_MY_PROFILE } from "../../graphql/mutations";

function FirstSetupComponent(props) {
  const match = useRouteMatch();
  const [calendar, setCalendar] = useState({
    summary: "",
    isCreated: false
  });
  const [tasks, setTasks] = useState([]);
  const [isSubmitDisabled, setIsSubmitDisabled] = useState(false);
  const [isNextDisabled, setIsNextDisabled] = useState(true);
  const [displayError, setDisplayError] = useState(false);
  const [createMyCalendar] = useMutation(CREATE_MY_CALENDAR);
  const [createMyTask] = useMutation(CREATE_MY_TASK);
  const [updateMyProfile] = useMutation(UPDATE_MY_PROFILE);

  const handleSetCalendar = calendar => {
    setCalendar(calendar);
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
    // this flag will notify a user that something has gone wrong
    let hasErrorOccured = false;

    // disable the submit button
    setIsSubmitDisabled(true);

    // create calendar
    try {
      await createMyCalendar({
        variables: {
          summary: calendar.summary,
          description: `Created by ${APP_NAME}`
        }
      });

      // update calendar in state
      newCalendar.isCreated = true;
      setCalendar(newCalendar);
    } catch (e) {
      hasErrorOccured = true;
    }

    // create tasks: execute creation (async) in order
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
              hasErrorOccured = true;
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
    try {
      await updateMyProfile({
        variables: {
          isFirstSetupCompleted: true
        }
      });
    } catch (e) {
      hasErrorOccured = true;
    }

    if (hasErrorOccured) {
      // re-enable the confirm button
      setIsSubmitDisabled(false);
      setIsNextDisabled(true);
    }
    // if submit succeeded, leave submit disabled, show next button
    else {
      setIsNextDisabled(false);
    }

    setDisplayError(hasErrorOccured);
  };

  // if first setup is already complete, then redirect to home
  const user = GetUser();
  if (user && user.isFirstSetupCompleted === true) {
    return (
      <div>
        You have already completed this!
        <Link to={`/home`}>Return home</Link>
      </div>
    );
  }

  // force redirect to first-setup/create-calendar if one is not set
  if (
    (!calendar || !calendar.summary) &&
    props.location.pathname !== `${match.path}/create-calendar`
  ) {
    return <Redirect to={`${match.path}/create-calendar`} />;
  }

  return (
    <div>
      <div>
        <Switch>
          <Route path={`${match.path}/create-calendar`}>
            <CalendarContainer onClick={handleSetCalendar} />
            {calendar && calendar.summary ? (
              <Button variant="info">
                <Link
                  to={`${match.path}/create-tasks`}
                  className="no-style"
                  style={{
                    textDecoration: "none",
                    color: "white"
                  }}
                >
                  Next
                </Link>
              </Button>
            ) : null}
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
              <ListGroup>
                <ListGroup.Item>
                  {calendar.summary}
                  {calendar.isCreated ? (
                    <FontAwesomeIcon icon={faCheck} />
                  ) : null}
                </ListGroup.Item>
              </ListGroup>
            </div>
            <div>
              <TaskList tasks={tasks}>
                <p>
                  These are your first tasks that we will create for you! You
                  can always edit them or add more later.
                </p>
              </TaskList>
            </div>
            {displayError ? (
              <p>
                An error has occured. Please try again. If this error continues,
                please notify a developer!
              </p>
            ) : null}
            {isSubmitDisabled ? null : (
              <button onClick={handleSubmit}>Submit</button>
            )}
            {isNextDisabled ? null : (
              <Button variant="info" className="mt-1">
                <Link
                  to={`/home`}
                  className="no-style"
                  style={{
                    textDecoration: "none",
                    color: "white"
                  }}
                >
                  Take me home!
                </Link>
              </Button>
            )}
          </Route>
          <Route path={`${match.path}`}>
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
            <p>So, what are you waiting for? Let&apos;s get started!</p>
            <Link to={`${match.path}/create-calendar`}>Okay!</Link>
          </Route>
        </Switch>
      </div>
    </div>
  );
}

FirstSetupComponent.propTypes = {
  calendar: PropTypes.string,
  location: PropTypes.object,
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
