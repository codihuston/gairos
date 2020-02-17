import React, { useState } from "react";

import GetTasks from "../../graphql/queries/hooks/get-tasks";
import { component as TaskSelect } from "../../components/select-text";
import { component as Loading } from "../../components/loading";
import { component as Tracker } from "../../components/tracker";

export default function Home() {
  const { error, data, loading } = GetTasks({
    fetchPolicy: "cache-and-network"
  });
  const [trackers, setTrackers] = useState([]);
  const [message, setMessage] = useState(null);

  const handleSelect = (e, data) => {
    setMessage(null);
    let shouldTrack = true;
    // if task is not already tracked
    for (let i = 0; i < trackers.length; i++) {
      const taskIsAlreadyTracked =
        data.id && trackers[i] && trackers[i].id && trackers[i].id === data.id;
      if (taskIsAlreadyTracked) {
        shouldTrack = false;
        break;
      }
    }
    // track it
    if (shouldTrack) {
      setTrackers([...trackers, data]);
    } else {
      const msg =
        `Task '${data.name}' is already being tracked. You may not track the` +
        ` same task more than once.`;
      console.warn(msg);
      setMessage(msg);
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
      <TaskSelect
        placeholder="Select a task"
        options={data.getMyTasks}
        displayMember="name"
        handleSelect={handleSelect}
      />
      {message ? <div>{message}</div> : null}
      {trackers.map(task => (
        <Tracker key={task.id} task={task}></Tracker>
      ))}
    </div>
  );
}
