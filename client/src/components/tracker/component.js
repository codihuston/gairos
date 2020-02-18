import React, { useState, useEffect } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faPlay, faPause, faStop } from "@fortawesome/pro-duotone-svg-icons";
import { Alert, Button } from "react-bootstrap";
import moment from "moment";
import "moment-precise-range-plugin";
import { cloneDeep } from "lodash";

import CreateMyTaskHistory from "../../graphql/mutations/hooks/create-my-task-history";

export default function Tracker({ task, originalTime: temp, handleRemove }) {
  // whether or not the tas is being tracked
  const [isTracking, setIsTracking] = useState(false);
  // set the very at very first play; used to display overall elapsed time
  // across multiple instances of tracking userTaskHistory
  const [originalTime, setOriginalTime] = useState(temp);
  // reset on each play
  const [startTime, setStartTime] = useState(null);
  // the initial value of elapsedTime is set to currentTime
  // on each second thereafter, 1 second is added to it (for each second that
  // the task is being tracked), used only for display purposes
  const [elapsedTime, setElapsedTime] = useState(null);
  const [error, setError] = useState(null);
  const [mutate, { loading, data }] = CreateMyTaskHistory();

  const handlePlay = () => {
    // start tracking
    setIsTracking(true);
    // TODO: set reference time for elapsedTime if not set yet USING MUTATION
    if (!originalTime) {
      setOriginalTime(new moment());
    }
    // init startTime
    setStartTime(new moment());
  };

  const handlePause = async () => {
    // stop tracking
    setIsTracking(false);
    // get endTime (now)
    const endTime = new moment();

    try {
      // create the instance w/ start+endTimes
      await mutate({
        variables: {
          userTaskId: task.userTaskInfo.id,
          startTime: startTime.toISOString(),
          endTime: endTime.toISOString()
        }
      });
    } catch (e) {
      console.error(e);
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
    handleRemove(task.id);
  };

  useEffect(() => {
    let interval = null;
    // only track current time if task is being tracked
    if (isTracking) {
      interval = setInterval(() => {
        // set the initial time if not set already
        if (!elapsedTime) {
          setElapsedTime(new moment());
        } else {
          // NOTE: must set state to new object to trigger re-render.
          // This uses the base time (from original value of elapsedTime)
          // instead of the literal current instant of time; this is done
          // to prevent the rendered output from "skipping". This is used
          // strictly for display purposes only!
          setElapsedTime(prev => cloneDeep(prev.add(1, "second")));
        }
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
