import React from "react";

import GetTasks from "../../graphql/queries/hooks/get-tasks";
import { component as TaskSelect } from "../../components/select-text";
import { component as Loading } from "../../components/loading";

export default function Home() {
  const { error, data, loading } = GetTasks({
    fetchPolicy: "cache-and-network"
  });

  const handleSelect = (e, data) => {
    console.log("Selected ", data);
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
      <div>Players go here</div>
      <div>Players go here</div>
      <div>Players go here</div>
      <div>Players go here</div>
    </div>
  );
}
