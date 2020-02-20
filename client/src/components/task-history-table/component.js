import React from "react";
import { Link } from "react-router-dom";
import { Row, Table, Form, Button } from "react-bootstrap";
import {
  useTable,
  useSortBy,
  useGlobalFilter,
  usePagination
} from "react-table";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faEdit, faTrash } from "@fortawesome/pro-duotone-svg-icons";

import moment from "moment";

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
    prepareRow,
    page,
    // Instead of using 'rows', we'll use page,
    // which has only the rows for the active page
    rows,

    // Pagination Props
    // The rest of these things are super handy, too ;)
    canPreviousPage,
    canNextPage,
    pageOptions,
    pageCount,
    gotoPage,
    nextPage,
    previousPage,
    setPageSize,
    state: {
      pageIndex,
      pageSize,
      globalFilter,
      //required in order for sort to work
      sortBy
    },

    // Search / Filtering Props
    preGlobalFilteredRows,
    setGlobalFilter
  } = useTable(
    {
      columns,
      data,
      initialState: { pageindex: 2 }
      // defaultColumn,
      // filterTypes
    },
    // useFilters,

    useGlobalFilter,
    useSortBy,
    usePagination
  );

  return (
    <>
      <GlobalFilter
        preGlobalFilteredRows={preGlobalFilteredRows}
        globalFilter={globalFilter}
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
          {page.map((row, i) => {
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
      <div>
        <button onClick={() => previousPage()} disabled={!canPreviousPage}>
          Previous Page
        </button>
        <button onClick={() => nextPage()} disabled={!canNextPage}>
          Next Page
        </button>
        <div>
          Page{" "}
          <em>
            {pageIndex + 1} of {pageOptions.length}
          </em>
        </div>
        <div>Go to page:</div>
        <input
          type="number"
          defaultValue={pageIndex + 1 || 1}
          onChange={e => {
            const page = e.target.value ? Number(e.target.value) - 1 : 0;
            gotoPage(page);
          }}
        />
        <select
          value={pageSize}
          onChange={e => {
            setPageSize(Number(e.target.value));
          }}
        >
          {[10, 20, 30, 40, 50].map(pageSize => (
            <option key={pageSize} value={pageSize}>
              Show {pageSize}
            </option>
          ))}
        </select>
        +{" "}
      </div>
    </>
  );
}

export default function TaskTable({ taskHistories, onEdit, onDelete }) {
  const columns = React.useMemo(
    () => [
      {
        Header: "Your Task History",
        columns: [
          {
            Header: "Name",
            accessor: "userTaskInfo.task.name",
            Cell: ({ row }) => {
              if (row && row.original) {
                return (
                  <div>
                    <span title={row.original.userTaskInfo.description}>
                      {row.original.userTaskInfo.task.name}
                    </span>
                  </div>
                );
              }
            }
          },
          {
            Header: "Start",
            accessor: "startTime",
            Cell: ({ row }) => {
              console.log(row);
              if (row && row.original) {
                return new moment(row.original.startTime).format(
                  "MM-DD-YYYY hh:mm:ss"
                );
              }
            }
          },
          {
            Header: "End",
            accessor: "endTime",
            Cell: ({ row }) => {
              if (row && row.original) {
                return (
                  <div>
                    <span>
                      {new moment(row.original.endTime).format(
                        "MM-DD-YYYY hh:mm:ss"
                      )}
                    </span>
                  </div>
                );
              }
            }
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
    [onEdit, onDelete]
  );

  return (
    <div>
      {taskHistories && taskHistories.length ? (
        <ReactTable columns={columns} data={taskHistories}></ReactTable>
      ) : (
        <p>You don't have any tasks yet!</p>
      )}
    </div>
  );
}
