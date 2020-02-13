import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
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
import UpdateMyTask from "../../graphql/mutations/hooks/update-my-task";
// import DeleteMyTask from "../../graphql/mutations/hooks/delete-my-task";

import { GET_MY_TASKS as query } from "../../graphql/queries";
import TaskList from "../task-list/component";

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
          <FontAwesomeIcon icon={faTrash} />
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

export const EditTaskModal = ({ show, handleClose, task }) => {
  const [mutate, { data, loading }] = UpdateMyTask();
  const [name, setName] = useState(task && task.name ? task.name : "");
  const [description, setDescription] = useState(
    task && task.userTaskInfo && task.userTaskInfo.description
      ? task.userTaskInfo.description
      : ""
  );
  const [error, setError] = useState("");

  const handleSubmit = async () => {
    setError("");

    try {
      await mutate({
        variables: {
          userTaskId: task.userTaskInfo.id,
          description
        },
        refetchQueries: [
          {
            query
          }
        ]
      });
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
        <Modal.Title>Edit {task && task.name ? task.name : "Task"}</Modal.Title>
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
                Task updated!
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
                Update
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
    <Form className="">
      <Form.Group as={Row} className="">
        <Form.Label htmlFor="search" className="col-sm-2 col-form-label">
          Search
        </Form.Label>
        <div className="col-sm-10">
          <Form.Control
            id="search"
            type="text"
            value={globalFilter || ""}
            onChange={e => {
              setGlobalFilter(e.target.value || undefined); // Set undefined to remove the filter entirely
            }}
            placeholder={`Search ${count} record(s)...`}
          />
        </div>
      </Form.Group>
    </Form>
  );
}

/**
 * TODO: implement memoization (don't re-render table unnecessarily when parent
 * state is updated, i.e. currentTask is update)
 * @param {*} param0
 */
function ReactTable({ columns, data }) {
  const {
    getTableProps,
    getTableBodyProps,
    headerGroups,
    rows,
    prepareRow,
    state,
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
      <GlobalFilter
        preGlobalFilteredRows={preGlobalFilteredRows}
        globalFilter={state.globalFilter}
        setGlobalFilter={setGlobalFilter}
      />
      <Table striped bordered hover size="sm" {...getTableProps()}>
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
      {/* <div>Showing the first 20 results of {rows.length} rows</div> */}
    </>
  );
}

export default function TaskTable({ tasks }) {
  const [currentTask, setCurrentTask] = useState(null);

  const [showCreateModal, setShowCreateModal] = useState(false);
  const handleCloseCreateModal = () => setShowCreateModal(false);
  const handleShowCreateModal = () => setShowCreateModal(true);

  const [showEditModal, setShowEditModal] = useState(false);
  const handleCloseEditModal = () => setShowEditModal(false);
  const handleShowEditModal = (e, data) => {
    setCurrentTask(data);
    setShowEditModal(true);
  };

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
          },
          {
            Header: "Options",
            Cell: ({ row }) => {
              if (row && row.original) {
                return (
                  <div>
                    <Button
                      variant="warning"
                      className="mr-1"
                      onClick={e => handleShowEditModal(e, row.original)}
                      // onClick={e => console.log(row.original)}
                    >
                      <FontAwesomeIcon alt="edit task" icon={faEdit} />
                    </Button>
                    <Button
                      variant="danger"
                      onClick={e => console.log(row.original)}
                    >
                      <FontAwesomeIcon alt="delete task" icon={faTrash} />
                    </Button>
                  </div>
                );
              }
            }
          }
        ]
      }
    ],
    []
  );

  return (
    <div>
      <h2>
        Manage Tasks
        <Button
          variant="primary"
          className="ml-1"
          onClick={handleShowCreateModal}
        >
          <FontAwesomeIcon icon={faPlus} />
          &nbsp;Create
        </Button>
      </h2>
      <p>
        Manage your tasks below. Later, you can track them{" "}
        <Link to="/track">here!</Link>
      </p>
      <CreateTaskModal
        show={showCreateModal}
        handleClose={handleCloseCreateModal}
      />
      {currentTask ? (
        <EditTaskModal
          show={showEditModal}
          handleClose={handleCloseEditModal}
          task={currentTask}
        />
      ) : (
        ""
      )}
      {tasks && tasks.length ? (
        <ReactTable columns={columns} data={tasks}></ReactTable>
      ) : (
        <p>You don't have any tasks yet!</p>
      )}
    </div>
  );
}
