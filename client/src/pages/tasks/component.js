import React, { useState } from "react";
import { Alert, Button } from "react-bootstrap";

import GetTasks from "../../graphql/queries/hooks/get-tasks";
import { component as Loading } from "../../components/loading";
import { component as TaskTable } from "../../components/task-table";
import { component as TaskArchiveModal } from "../../components/task-archive-modal";

export default function Home() {
  const { error, data, loading } = GetTasks({
    fetchPolicy: "cache-and-network"
  });
  const [show, setShow] = useState(false);
  const handleClose = () => setShow(false);
  const handleShow = () => setShow(true);

  if (loading) {
    return <Loading />;
  } else if (error) {
    console.error(error);
    return (
      <Alert variant="danger">
        There was a problem loading your tasks :(. Please try again later.
        Please notify a developer if this persists!
      </Alert>
    );
  } else {
    // TODO: separate archived tasks from non-archived tasks
    const tasks = [];
    const archivedTasks = [];
    data.getMyTasks.filter(task => {
      if (task.userTaskInfo.isArchived) {
        archivedTasks.push(task);
      } else {
        tasks.push(task);
      }
    });

    return (
      <div>
        {/* only show non-archived tasks */}
        <TaskTable tasks={tasks} />
        <TaskArchiveModal
          show={show}
          handleClose={handleClose}
          tasks={archivedTasks}
        />
        <Button variant="secondary" onClick={handleShow}>
          Show Archive
        </Button>
      </div>
    );
  }
}
