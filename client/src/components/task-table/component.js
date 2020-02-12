import React, { useState } from "react";
import {
  Container,
  Row,
  Table,
  Modal,
  Form,
  Button,
  Alert
} from "react-bootstrap";
import { useTable, useSortBy, useGlobalFilter } from "react-table";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faEdit, faTrash } from "@fortawesome/pro-duotone-svg-icons";
import { faPlus } from "@fortawesome/pro-light-svg-icons";

import { component as Loading } from "../loading";
import CreateMyTask from "../../graphql/mutations/hooks/create-my-task";
import DeleteMyTask from "../../graphql/mutations/hooks/delete-my-task";

import { GET_MY_TASKS as query } from "../../graphql/queries";

export const DeleteTaskModal = ({ show, handleClose, handleConfirm }) => {
  return (
    <Modal show={show} onHide={handleClose} animation={false}>
      <Modal.Header closeButton>
        <Modal.Title>Delete A Task</Modal.Title>
      </Modal.Header>
      <Modal.Body>Are you sure you want to delete this task?</Modal.Body>
      <Modal.Footer>
        <Button onClick={handleConfirm}>Yes</Button>
        <Button onClick={handleClose}>Cancel</Button>
      </Modal.Footer>
    </Modal>
  );
};

export const TaskTableRow = ({ task, onDelete }) => {
  return (
    <tr>
      <td>{task.name}</td>
      <td>
        {task.userTaskInfo && task.userTaskInfo.description ? (
          task.userTaskInfo.description
        ) : (
          <i>None</i>
        )}
      </td>
      <td>
        <button alt="edit button">
          <FontAwesomeIcon icon={faEdit} />
        </button>
        <button alt="delete button" onClick={e => onDelete(e, task)}>
          <FontAwesomeIcon icon={faTrash} />
        </button>
      </td>
    </tr>
  );
};

export const CreateTaskModal = ({ show, handleClose }) => {
  const [mutate, { data, loading }] = CreateMyTask();
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [error, setError] = useState("");

  const handleSubmit = async () => {
    setError("");

    try {
      await mutate({
        variables: {
          name,
          description
        },
        refetchQueries: [
          {
            query
          }
        ]
      });

      setName("");
      setDescription("");
    } catch (e) {
      setError(e.message);
    }
  };

  const handleChangeName = e => {
    setName(e.target.value);
  };

  const handleChangeDescription = e => {
    setDescription(e.target.value);
  };

  return (
    <Modal show={show} onHide={handleClose} animation={false}>
      <Modal.Header closeButton>
        <Modal.Title>Create A Task</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <Form>
          <Form.Group controlId="formTaskName">
            <Form.Label>Name</Form.Label>
            <Form.Control
              type="text"
              placeholder="Name your task"
              value={name}
              onChange={handleChangeName}
            />
          </Form.Group>

          <Form.Group controlId="formTaskDescription">
            <Form.Label>Description</Form.Label>
            <Form.Control
              type="text"
              placeholder="Describe your task"
              value={description}
              onChange={handleChangeDescription}
            />
            {error ? (
              <Alert variant="danger" className="mt-1">
                {error}
              </Alert>
            ) : null}
            {data ? (
              <Alert variant="success" className="mt-1">
                Task created!
              </Alert>
            ) : null}
          </Form.Group>
          <Container fluid className="mt-1">
            <Row className="justify-content-end">
              {loading ? <Loading /> : null}
              <Button
                variant="primary"
                onClick={handleSubmit}
                style={{
                  visibility: loading ? "hidden" : "visible"
                }}
              >
                Create
              </Button>
              <Button
                variant="secondary"
                onClick={handleClose}
                style={{
                  visibility: loading ? "hidden" : "visible"
                }}
              >
                Cancel
              </Button>
            </Row>
          </Container>
        </Form>
      </Modal.Body>
    </Modal>
  );
};

function GlobalFilter({
  preGlobalFilteredRows,
  globalFilter,
  setGlobalFilter
}) {
  const count = preGlobalFilteredRows.length;

  return (
    <span>
      Search:{" "}
      <input
        value={globalFilter || ""}
        onChange={e => {
          setGlobalFilter(e.target.value || undefined); // Set undefined to remove the filter entirely
        }}
        placeholder={`${count} records...`}
        style={{
          fontSize: "1.1rem",
          border: "0"
        }}
      />
    </span>
  );
}

function ReactTable({ columns, data }) {
  const {
    getTableProps,
    getTableBodyProps,
    headerGroups,
    rows,
    prepareRow,
    state,
    flatColumns,
    preGlobalFilteredRows,
    setGlobalFilter
  } = useTable(
    {
      columns,
      data
    },
    useGlobalFilter,
    useSortBy
  );

  const firstPageRows = rows.slice(0, 20);

  return (
    <>
      <Table {...getTableProps()}>
        <thead>
          {headerGroups.map(headerGroup => (
            <tr {...headerGroup.getHeaderGroupProps()}>
              {headerGroup.headers.map(column => (
                <th {...column.getHeaderProps(column.getSortByToggleProps())}>
                  {column.render("Header")}
                  <span>
                    {column.isSorted
                      ? column.isSortedDesc
                        ? " DOWN"
                        : " UP"
                      : ""}
                  </span>
                </th>
              ))}
            </tr>
          ))}
          <tr>
            <th
              colSpan={flatColumns.length}
              style={{
                textAlign: "left"
              }}
            >
              <GlobalFilter
                preGlobalFilteredRows={preGlobalFilteredRows}
                globalFilter={state.globalFilter}
                setGlobalFilter={setGlobalFilter}
              />
            </th>
          </tr>
        </thead>
        <tbody {...getTableBodyProps()}>
          {firstPageRows.map((row, i) => {
            prepareRow(row);
            return (
              <tr {...row.getRowProps()}>
                {row.cells.map(cell => {
                  return (
                    <td {...cell.getCellProps()}>{cell.render("Cell")}</td>
                  );
                })}
              </tr>
            );
          })}
        </tbody>
      </Table>
      <div>Showing the first 20 results of {rows.length} rows</div>
    </>
  );
}

export default function TaskTable({ tasks }) {
  const columns = React.useMemo(
    () => [
      {
        Header: "Your Tasks",
        columns: [
          {
            Header: "Name",
            accessor: "name"
          },
          {
            Header: "Description",
            accessor: "userTaskInfo.description"
          }
        ]
      }
    ],
    []
  );

  return <ReactTable columns={columns} data={tasks}></ReactTable>;
  // const [showCreateModal, setShowCreateModal] = useState(false);
  // const handleCloseCreateModal = () => setShowCreateModal(false);
  // const handleShowCreateModal = () => setShowCreateModal(true);

  // const [showDeleteModal, setShowDeleteModal] = useState(false);
  // const [taskToDelete, setSetTaskToDelete] = useState(null);
  // const handleCloseDeleteModal = () => setShowDeleteModal(false);
  // const handleShowDeleteModal = (e, data) => {
  //   setShowDeleteModal(true);
  //   setSetTaskToDelete(data);
  //   console.log("DELETE", data);
  // };
  // const [mutate] = DeleteMyTask();

  // const handleDelete = async cb => {
  //   try {
  //     await mutate({
  //       variables: {
  //         userTaskId: taskToDelete.userTaskInfo.id
  //       },
  //       refetchQueries: [
  //         {
  //           query
  //         }
  //       ]
  //     });
  //   } catch (e) {
  //     alert(
  //       `${e.message}. Please try again later, or contact a developer if the error persists.`
  //     );
  //   }
  // };

  // if (!tasks.length) return <div>No Tasks Provided!</div>;

  // return (
  //   <div>
  //     <h2>Your Tasks</h2>
  //     <Button variant="primary" onClick={handleShowCreateModal}>
  //       <FontAwesomeIcon icon={faPlus} />
  //       &nbsp;Create
  //     </Button>
  //     <CreateTaskModal
  //       show={showCreateModal}
  //       handleClose={handleCloseCreateModal}
  //     />
  //     <DeleteTaskModal
  //       show={showDeleteModal}
  //       handleConfirm={handleDelete}
  //       handleClose={handleCloseDeleteModal}
  //     />
  //     <Table striped bordered hover size="sm">
  //       <thead>
  //         <tr>
  //           <th>Name</th>
  //           <th>Description</th>
  //           <th>Info</th>
  //         </tr>
  //       </thead>
  //       <tbody>
  //         {tasks.map(task => (
  //           <TaskTableRow
  //             key={task.id}
  //             task={task}
  //             onDelete={handleShowDeleteModal}
  //           />
  //         ))}
  //       </tbody>
  //     </Table>
  //   </div>
  // );
}
