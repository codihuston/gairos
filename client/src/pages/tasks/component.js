import React from "react";
import { Alert } from "react-bootstrap";

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

  if (error) {
    console.error(error);
    return (
      <Alert variant="danger">
        There was a problem loading your tasks :(. Please try again later.
        Please notify a developer if this persists!
      </Alert>
    );
  }
  return (
    <div>
      <TaskTable tasks={data.getMyTasks} />
    </div>
  );
}
