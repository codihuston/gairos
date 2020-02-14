import React, { useState } from "react";
import { Alert, Button } from "react-bootstrap";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faPlus } from "@fortawesome/pro-light-svg-icons";

import GetTasks from "../../graphql/queries/hooks/get-tasks";
import { component as Loading } from "../../components/loading";
import { component as TaskTable } from "../../components/task-table";
import { component as TaskArchiveModal } from "../../components/task-archive-modal";
import { component as CreateTaskModal } from "../../components/task-create-modal";
import { component as UpdateTaskModal } from "../../components/task-update-modal";

export default function Home() {
  const { error, data, loading } = GetTasks({
    fetchPolicy: "cache-and-network"
  });
  const [currentTask, setCurrentTask] = useState(null);

  const [show, setShow] = useState(false);
  const handleClose = () => setShow(false);
  const handleShow = () => setShow(true);

  const [showCreateModal, setShowCreateModal] = useState(false);
  const handleCloseCreateModal = () => setShowCreateModal(false);
  const handleShowCreateModal = () => setShowCreateModal(true);

  const [showEditModal, setShowEditModal] = useState(false);
  const handleCloseEditModal = () => setShowEditModal(false);
  const handleShowEditModal = (e, data) => {
    setCurrentTask(data);
    setShowEditModal(true);
  };

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
    // separate archived tasks from non-archived tasks
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
        <h2>
          Manage Tasks
          <Button
            variant="primary"
            className="ml-1 mr-1"
            onClick={handleShowCreateModal}
          >
            <FontAwesomeIcon icon={faPlus} />
            &nbsp;Create
          </Button>
          <Button variant="secondary" onClick={handleShow}>
            Show Archive
          </Button>
        </h2>
        <TaskTable tasks={tasks} onEdit={handleShowEditModal} />
        <CreateTaskModal
          show={showCreateModal}
          handleClose={handleCloseCreateModal}
        />
        <UpdateTaskModal
          show={showEditModal}
          handleClose={handleCloseEditModal}
          task={currentTask}
        />
        <TaskArchiveModal
          show={show}
          handleClose={handleClose}
          tasks={archivedTasks}
        />
      </div>
    );
  }
}
