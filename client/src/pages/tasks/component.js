import React from "react";

import GetTasks from "../../graphql/queries/hooks/get-tasks";
import { component as Loading } from "../../components/loading";
import { component as TaskTable } from "../../components/task-table";

export default function Home() {
  const { error, data, loading } = GetTasks();

  if (loading) {
    return <Loading />;
  }

  console.log(data);
  return (
    <div>
      <TaskTable tasks={data.getMyTasks} />
    </div>
  );
}
