import React from "react";

import GetMyTaskHistory from "../../graphql/queries/hooks/get-my-task-history";
import { component as TaskHistoryTable } from "../../components/task-history-table";

export default function Home() {
  const { data, loading, error } = GetMyTaskHistory();

  const handleEdit = (e, data) => {
    console.log("TODO: edit", data);
  };

  const handleDelete = (e, data) => {
    console.log("TODO: delete", data);
  };

  if (loading) {
    return <div>loading</div>;
  }

  console.log(data);

  return (
    <div>
      <TaskHistoryTable
        taskHistories={data.getMyTaskHistory}
        onEdit={handleEdit}
        onDelete={handleDelete}
      ></TaskHistoryTable>
    </div>
  );
}
