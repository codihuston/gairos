import React, { useState } from "react";
import { toast } from "react-toastify";
import { useQuery, useMutation } from "react-apollo";
import gql from "graphql-tag";

import GetTasks from "../../graphql/queries/hooks/get-tasks";
import GetMyTrackers from "../../graphql/queries/hooks/get-trackers";
import { GET_MY_TRACKERS } from "../../graphql/queries";
import { CREATE_MY_TRACKER } from "../../graphql/mutations";
import { component as TaskSelect } from "../../components/select-text";
import { component as Loading } from "../../components/loading";
import { component as Tracker } from "../../components/tracker";

/**
 * TODO: clean this up!
 * [x] clean up apollo-client service
 * [x] create resolvers/typeDefs file for client
 * - define Tracker Type
 * - properly add / query the cached Trackers
 * [x] Load trackers from cache
 * - remove a cached Tracker when a tracker is "Stopped"
 */
export default function Home() {
  const { error, data, loading } = GetTasks({
    fetchPolicy: "cache-and-network"
  });
  const { data: trackers } = GetMyTrackers();
  const [mutate] = useMutation(CREATE_MY_TRACKER);

  const handleSelect = async (e, task) => {
    let shouldTrack = true;
    // if task is not already tracked
    for (let i = 0; i < trackers.length; i++) {
      const taskIsAlreadyTracked =
        task.id && trackers[i] && trackers[i].id && trackers[i].id === task.id;
      if (taskIsAlreadyTracked) {
        shouldTrack = false;
        break;
      }
    }
    // track it
    if (shouldTrack) {
      // TODO: mutate tracker task
      console.log("add user task", task.userTaskInfo.id);
      try {
        await mutate({
          variables: {
            id: task.userTaskInfo.id,
            task,
            isTracking: false,
            startTime: null,
            originalTime: null
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

      // setTrackers([...trackers, task]);
    } else {
      const msg =
        `Task '${task.name}' is already being tracked. You may not track the` +
        ` same task more than once.`;
      console.warn(msg);
      toast.warn(msg);
    }
  };

  const handleRemove = id => {
    const temp = trackers.filter(task => task.id !== id);
    // TODO: use mutation to delete the tracker
    // setTrackers(temp);
  };

  if (loading) {
    return <Loading />;
  }
  if (error) {
    return <div>Error: {error.message}</div>;
  }

  return (
    <div>
      <TaskSelect
        placeholder="Select a task"
        options={data.getMyTasks}
        displayMember="name"
        handleSelect={handleSelect}
      />
      {trackers.getTrackers &&
        trackers.getTrackers.map(tracker => (
          <Tracker
            key={tracker.task.userTaskInfo.id}
            task={tracker.task}
            isTracking={tracker.isTracking}
            startTime={tracker.startTime}
            originalTime={tracker.originalTime}
            handleRemove={handleRemove}
          ></Tracker>
        ))}
    </div>
  );
}
