import React from "react";

import GetTasks from "../../graphql/queries/hooks/get-tasks";
import { component as Loading } from "../../components/loading";
import { component as TaskTable } from "../../components/task-table";

export default function Home() {
  const { error, data, loading } = GetTasks({
    fetchPolicy: "cache-and-network"
  });

  if (loading) {
    return <Loading />;
  }

  console.log(data, error);
  return (
    <div>
      <TaskTable tasks={data.getMyTasks} />
    </div>
  );
}
