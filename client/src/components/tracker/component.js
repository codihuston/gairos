import React, { useState, useEffect, useRef } from "react";
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
  elapsedTime: lastElapsedTime,
  handleRemove
}) {
  // the initial value of elapsedTime is set to currentTime
  // on each second thereafter, 1 second is added to it (for each second that
  // the task is being tracked), used only for display purposes
  const [elapsedTime, setElapsedTime] = useState(
    lastElapsedTime ? new moment(lastElapsedTime) : null
  );
  const [error, setError] = useState(null);
  const [createTaskHistory, { loading: loadingCreate }] = CreateMyTaskHistory();
  const [updateMyTracker, { loading: loadingUpdate }] = UpdateMyTracker();
  const savedCallback = useRef();

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
          startTime: new moment().toISOString(),
          elapsedTime,
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
          originalTime,
          elapsedTime: elapsedTime.toISOString()
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
          startTime: startTime,
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
          "You are currently tracking this task. " +
            "Click 'OK' to save this progress. " +
            "Click 'Cancel' to discard this progress."
        ) === true;
      if (confirm) {
        handlePause();
      }
    }
    // remove self from dom
    handleRemove(task.userTaskInfo.id);
  };

  function callback() {
    // initialize elapsedTime only if originalTime is initialized. originalTime
    // is only initialized when "play" is clicked the first time. This fixes the
    // "reverse countdown issue" that occurs when opening a tracker, waiting
    // X seconds, and starting it. In that case, the tracker would COUNT DOWN
    // from now + X seconds until 0 is reached then count up
    if (originalTime && !elapsedTime) {
      setElapsedTime(new moment());
    }

    // only track current time if task is being tracked
    if (isTracking) {
      // NOTE: must set state to new object to trigger re-render.
      // This uses the base time (from original value of elapsedTime)
      // instead of the literal current instant of time; this is done
      // to prevent the rendered output from "skipping". This is used
      // strictly for display purposes only!
      setElapsedTime(prev => cloneDeep(prev.add(1, "second")));

      // update last elapsedTime (so elapsedTime is correct on refreshes)
      try {
        updateMyTracker({
          variables: {
            id: task.userTaskInfo.id,
            task,
            isTracking,
            startTime,
            originalTime,
            elapsedTime: elapsedTime ? elapsedTime.toISOString() : null
          },
          refetchQueries: [
            {
              query: GET_MY_TRACKERS
            }
          ]
        });
      } catch (e) {
        console.error(e);
      }
    }
  }

  useEffect(() => {
    savedCallback.current = callback;
  });

  useEffect(() => {
    function tick() {
      savedCallback.current();
    }

    let id = setInterval(tick, 1000);
    return () => clearInterval(id);
  }, []);

  // useEffect(() => {
  //   let interval = null;

  //   // initialize elapsedTime only if originalTime is initialized. originalTime
  //   // is only initialized when "play" is clicked the first time. This fixes the
  //   // "reverse countdown issue" that occurs when opening a tracker, waiting
  //   // X seconds, and starting it. In that case, the tracker would COUNT DOWN
  //   // from now + X seconds until 0 is reached then count up
  //   if (originalTime && !elapsedTime) {
  //     setElapsedTime(new moment());
  //   }

  //   // only track current time if task is being tracked
  //   if (isTracking) {
  //     interval = setInterval(() => {
  //       // NOTE: must set state to new object to trigger re-render.
  //       // This uses the base time (from original value of elapsedTime)
  //       // instead of the literal current instant of time; this is done
  //       // to prevent the rendered output from "skipping". This is used
  //       // strictly for display purposes only!
  //       setElapsedTime(prev => cloneDeep(prev.add(1, "second")));

  //       // update last elapsedTime (so elapsedTime is correct on refreshes)
  //       updateMyTracker({
  //         variables: {
  //           id: task.userTaskInfo.id,
  //           task,
  //           isTracking,
  //           startTime,
  //           originalTime,
  //           elapsedTime: elapsedTime.toISOString()
  //         },
  //         refetchQueries: [
  //           {
  //             query: GET_MY_TRACKERS
  //           }
  //         ]
  //       });
  //     }, 1000);
  //   }

  //   return () => {
  //     clearInterval(interval);
  //   };
  // });

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
