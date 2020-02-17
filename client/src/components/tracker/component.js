import React, { useState, useEffect } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faPlay, faPause, faStop } from "@fortawesome/pro-duotone-svg-icons";
import { Button } from "react-bootstrap";
import moment from "moment";
import "moment-precise-range-plugin";
import { cloneDeep } from "lodash";

export default function Tracker({ task, handleRemove }) {
  // whether or not the tas is being tracked
  const [isTracking, setIsTracking] = useState(false);
  // set the very at very first play; used to display overall elapsed time
  // across multiple instances of tracking userTaskHistory
  const [originalTime, setOriginalTime] = useState(null);
  // reset on each play
  const [startTime, setStartTime] = useState(null);
  // the initial value of elapsedTime is set to currentTime
  // on each second thereafter, 1 second is added to it (for each second that
  // the task is being tracked), used only for display purposes
  const [elapsedTime, setElapsedTime] = useState(null);

  const handlePlay = () => {
    setIsTracking(true);
    if (!originalTime) {
      setOriginalTime(new moment());
    }
    setStartTime(new moment());
  };

  const handlePause = () => {
    setIsTracking(false);
    const endTime = new moment();
    // TODO: create userTaskHistory with current startTime and NOW
    console.log(
      "Create userTaskHistory",
      startTime.toISOString(),
      endTime.toISOString()
    );
  };

  const handleStop = () => {
    // stop tracking
    if (isTracking) {
      handlePause();
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
          // NOTE: must set state to new object to trigger re-render
          // this uses the base time (from original value of elapsedTime)
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
        {isTracking ? (
          <Button variant="warning" onClick={handlePause}>
            <FontAwesomeIcon icon={faPause} />
          </Button>
        ) : (
          <Button variant="success" onClick={handlePlay}>
            <FontAwesomeIcon icon={faPlay} />
          </Button>
        )}
        <Button variant="danger" onClick={handleStop}>
          <FontAwesomeIcon icon={faStop} />
        </Button>
      </div>
    </div>
  );
}
