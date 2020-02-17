import React, { useState, useEffect } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faPlay, faStop } from "@fortawesome/pro-duotone-svg-icons";
import { Button } from "react-bootstrap";
import moment from "moment";
import "moment-precise-range-plugin";
import { cloneDeep } from "lodash";

export default function Tracker({ task }) {
  const [isTracking, setIsTracking] = useState(false);
  const [startTime, setStartTime] = useState(null);
  const [elapsedTime, setElapsedTime] = useState(null);
  // const [interval, setInterval] = useState()
  const [currentTime, setCurrentTime] = useState(null);

  const handlePlay = () => {
    setIsTracking(true);
    setStartTime(new moment());
  };

  const handleStop = () => {
    setIsTracking(false);
    const endTime = new moment();
    // TODO: create userTaskHistory with current startTime and NOW
    console.log(
      "Create userTaskHistory",
      startTime.toISOString(),
      endTime.toISOString()
    );
  };

  useEffect(() => {
    let interval = null;
    if (isTracking) {
      interval = setInterval(() => {
        if (!currentTime) {
          setCurrentTime(new moment());
        } else {
          // must set state to new object to trigger re-render
          setCurrentTime(prev => cloneDeep(prev.add(1, "second")));
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
        {startTime && currentTime ? currentTime.preciseDiff(startTime) : null}
      </div>
      <div>
        {isTracking ? (
          <Button variant="danger" onClick={handleStop}>
            <FontAwesomeIcon icon={faStop} />
          </Button>
        ) : (
          <Button variant="success" onClick={handlePlay}>
            <FontAwesomeIcon icon={faPlay} />
          </Button>
        )}
      </div>
    </div>
  );
}
