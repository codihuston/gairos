import React, { useState, useRef } from "react";
import { Link } from "react-router-dom";
import { Row, Table, Form, Button } from "react-bootstrap";
import { useTable, useSortBy, useGlobalFilter } from "react-table";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faEdit, faTrash } from "@fortawesome/pro-duotone-svg-icons";

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

export default function TaskTable({ tasks, onEdit, onDelete }) {
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
                      onClick={e => onEdit(e, row.original)}
                    >
                      <FontAwesomeIcon alt="edit task" icon={faEdit} />
                    </Button>
                    <Button
                      variant="danger"
                      onClick={e => onDelete(e, row.original)}
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
      <p>
        Manage your tasks below. Later, you can track them{" "}
        <Link to="/track">here!</Link>
      </p>
      {tasks && tasks.length ? (
        <ReactTable columns={columns} data={tasks}></ReactTable>
      ) : (
        <p>You don't have any tasks yet!</p>
      )}
    </div>
  );
}
