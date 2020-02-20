import React, { useState } from "react";

import GetMyTaskHistory from "../../graphql/queries/hooks/get-my-task-history";
import { component as TaskHistoryTable } from "../../components/task-history-table";
import { component as UpdateTaskHistoryModal } from "../../components/task-history-update-modal";
import { component as DeleteTaskHistoryModal } from "../../components/task-history-delete-modal";

export default function Home() {
  const { data, loading, error } = GetMyTaskHistory();
  const [currentHistory, setCurrentHistory] = useState(null);

  const [showEditModal, setShowEditModal] = useState(false);
  const handleCloseEditModal = () => setShowEditModal(false);
  const handleShowEditModal = (e, data) => {
    setCurrentHistory(data);
    setShowEditModal(true);
  };

  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const handleCloseDeleteModal = () => setShowDeleteModal(false);
  const handleShowDeleteModal = (e, data) => {
    setCurrentHistory(data);
    setShowDeleteModal(true);
  };

  if (loading) {
    return <div>loading</div>;
  }

  return (
    <div>
      <TaskHistoryTable
        taskHistories={data.getMyTaskHistory}
        onEdit={handleShowEditModal}
        onDelete={handleShowDeleteModal}
      ></TaskHistoryTable>
      <UpdateTaskHistoryModal
        show={showEditModal}
        handleClose={handleCloseEditModal}
        taskHistory={currentHistory}
      />
      <DeleteTaskHistoryModal
        show={showDeleteModal}
        handleClose={handleCloseDeleteModal}
        taskHistory={currentHistory}
      />
    </div>
  );
}
