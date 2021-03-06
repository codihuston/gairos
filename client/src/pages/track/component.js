import React from "react";
import { toast } from "react-toastify";
import { useMutation } from "react-apollo";

import GetTasks from "../../graphql/queries/hooks/get-tasks";
import GetMyTrackers from "../../graphql/queries/hooks/get-trackers";
import { GET_MY_TRACKERS } from "../../graphql/queries";
import { CREATE_MY_TRACKER } from "../../graphql/mutations";
import DeleteMyTracker from "../../graphql/mutations/hooks/delete-my-tracker";
import { component as TaskSelect } from "../../components/select-text";
import { component as Loading } from "../../components/loading";
import { component as Tracker } from "../../components/tracker";

export default function Home() {
  const { error, data, loading } = GetTasks({
    fetchPolicy: "cache-and-network"
  });
  const { data: trackers } = GetMyTrackers();
  const [mutate] = useMutation(CREATE_MY_TRACKER);
  const [deleteTracker] = DeleteMyTracker();

  const handleSelect = async (e, task) => {
    const { getTrackers } = trackers;
    let shouldTrack = true;
    // if task is not already tracked
    for (let i = 0; i < getTrackers.length; i++) {
      const taskIsAlreadyTracked =
        task.userTaskInfo &&
        getTrackers[i] &&
        getTrackers[i].task &&
        getTrackers[i].task.userTaskInfo &&
        getTrackers[i].task.userTaskInfo.id === task.userTaskInfo.id;
      if (taskIsAlreadyTracked) {
        shouldTrack = false;
        break;
      }
    }
    // track it
    if (shouldTrack) {
      // mutate task tracker
      try {
        await mutate({
          variables: {
            id: task.userTaskInfo.id,
            task,
            isTracking: false,
            startTime: null,
            originalTime: null,
            elapsedTime: null
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
    } else {
      const msg =
        `Task '${task.name}' is already being tracked. You may not track the` +
        ` same task more than once.`;
      console.warn(msg);
      toast.warn(msg);
    }
  };

  const handleRemove = async id => {
    try {
      await deleteTracker({
        variables: {
          id
        },
        refetchQueries: [
          {
            query: GET_MY_TRACKERS
          }
        ]
      });
    } catch (e) {
      console.error(e);
      toast.error(e);
    }
  };

  if (loading) {
    return <Loading />;
  }
  if (error) {
    return <div>Error: {error.message}</div>;
  }

  return (
    <div>
      <div
        className="mx-auto"
        style={{
          width: "80%"
        }}
      >
        <TaskSelect
          placeholder="Select a task"
          options={data.getMyTasks}
          displayMember="name"
          handleSelect={handleSelect}
        />
        <div className="d-flex flex-wrap justify-content-center">
          {trackers.getTrackers &&
            trackers.getTrackers.map(tracker => {
              return (
                <Tracker
                  key={tracker.task.userTaskInfo.id}
                  task={tracker.task}
                  isTracking={tracker.isTracking}
                  startTime={tracker.startTime}
                  originalTime={tracker.originalTime}
                  elapsedTime={tracker.elapsedTime}
                  handleRemove={handleRemove}
                ></Tracker>
              );
            })}
        </div>
      </div>
    </div>
  );
}
