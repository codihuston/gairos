import React, { useState, useEffect } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faPlay, faPause, faStop } from "@fortawesome/pro-duotone-svg-icons";
import { Alert, Button } from "react-bootstrap";
import moment from "moment";
import "moment-precise-range-plugin";
import { cloneDeep } from "lodash";

import { GET_MY_TRACKERS } from "../../graphql/queries";
import CreateMyTaskHistory from "../../graphql/mutations/hooks/create-my-task-history";
import UpdateMyTracker from "../../graphql/mutations/hooks/update-my-tracker";

export default function Tracker({
  task,
  // whether or not the task is being tracked
  isTracking,
  // reset on each play (each pause/play peroid is ONE record in db)
  startTime,
  // set the very at very first play; used to display overall elapsed time
  // across multiple instances of tracking userTaskHistory
  originalTime,
  handleRemove
}) {
  // the initial value of elapsedTime is set to currentTime
  // on each second thereafter, 1 second is added to it (for each second that
  // the task is being tracked), used only for display purposes
  const [elapsedTime, setElapsedTime] = useState(null);
  const [error, setError] = useState(null);
  const [createTaskHistory, { loading: loadingCreate }] = CreateMyTaskHistory();
  const [updateMyTracker, { loading: loadingUpdate }] = UpdateMyTracker();

  const loading = loadingCreate || loadingUpdate;

  const handlePlay = async () => {
    let temp = originalTime;
    // set reference time for elapsedTime if not set yet
    if (!originalTime) {
      // setOriginalTime(new moment());
      temp = new moment();
    }

    try {
      // update tracker with the new startTime and originalTime (client cache)
      await updateMyTracker({
        variables: {
          id: task.userTaskInfo.id,
          task,
          isTracking: true,
          startTime: new moment(),
          originalTime: temp
        },
        refetchQueries: [
          {
            query: GET_MY_TRACKERS
          }
        ]
      });
    } catch (e) {
      setError(e);
    }
  };

  const handlePause = async () => {
    try {
      // get endTime (now)
      const endTime = new moment();

      // stop the tracker (client cache)
      await updateMyTracker({
        variables: {
          id: task.userTaskInfo.id,
          task,
          isTracking: false,
          startTime,
          originalTime
        },
        refetchQueries: [
          {
            query: GET_MY_TRACKERS
          }
        ]
      });
      // create the instance w/ start+endTimes (database)
      await createTaskHistory({
        variables: {
          userTaskId: task.userTaskInfo.id,
          startTime: startTime.toISOString(),
          endTime: endTime.toISOString()
        }
      });
    } catch (e) {
      setError(e);
    }
  };

  const handleStop = () => {
    // stop tracking
    if (isTracking) {
      const confirm =
        window.confirm(
          "Do you want to save the currently tracked progress?"
        ) === true;
      if (confirm) {
        handlePause();
      }
    }
    // remove self from dom
    handleRemove(task.userTaskInfo.id);
  };

  useEffect(() => {
    let interval = null;
    // set the initial time if not set already
    if (!elapsedTime) {
      setElapsedTime(new moment());
    }

    // only track current time if task is being tracked
    if (isTracking) {
      interval = setInterval(() => {
        // NOTE: must set state to new object to trigger re-render.
        // This uses the base time (from original value of elapsedTime)
        // instead of the literal current instant of time; this is done
        // to prevent the rendered output from "skipping". This is used
        // strictly for display purposes only!
        setElapsedTime(prev => cloneDeep(prev.add(1, "second")));
      }, 1000);
    }

    return () => {
      clearInterval(interval);
    };
  });

  return (
    <div>
      <div title={task.description}>{task.name}</div>
      <div>
        Elapsed Time:{" "}
        {originalTime && elapsedTime
          ? elapsedTime.preciseDiff(originalTime)
          : null}
      </div>
      <div>
        {error ? <Alert variant="danger">{error.message}</Alert> : null}
      </div>
      <div>
        {loading ? (
          "Saving..."
        ) : (
          <>
            {isTracking ? (
              <Button variant="warning" onClick={handlePause}>
                <FontAwesomeIcon icon={faPause} />
              </Button>
            ) : (
              <Button variant="success" onClick={handlePlay}>
                <FontAwesomeIcon icon={faPlay} />
              </Button>
            )}
            <Button variant="danger" className="ml-1" onClick={handleStop}>
              <FontAwesomeIcon icon={faStop} />
            </Button>
          </>
        )}
      </div>
    </div>
  );
}