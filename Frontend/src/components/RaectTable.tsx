import React, { useState, useRef } from "react";
import { columns } from "../utils/tableColumns";
import {
  useReactTable,
  getCoreRowModel,
  flexRender,
  getPaginationRowModel,
} from "@tanstack/react-table";
import { useQuery } from "@tanstack/react-query";
import { FiFilter } from "react-icons/fi";
import Pagination from "./Pagination";
import { fetchData } from "../api/api";

const limit = import.meta.env.VITE_LIMIT_PER_PAGES;

const ReactTable: React.FC = () => {
  const [pageIndex, setPageIndex] = useState(0);
  const [showFilters, setShowFilters] = useState(false);
  const [filters, setFilters] = useState<{ [key: string]: string }>({});
  const [inputValues, setInputValues] = useState<{ [key: string]: string }>({});
  const [jumpPage, setJumpPage] = useState("1");
  const debounceTimeout = useRef<number | null>(null);

  const handleFilterChange = (
    e: React.ChangeEvent<HTMLInputElement>,
    column: string
  ) => {
    const value = e.target.value;
    setInputValues((prev) => ({
      ...prev,
      [column]: value,
    }));

    if (debounceTimeout.current) {
      clearTimeout(debounceTimeout.current);
    }

    debounceTimeout.current = setTimeout(() => {
      setFilters((prev) => {
        const newFilters = { ...prev };
        if (value.trim() === "") {
          delete newFilters[column];
        } else {
          newFilters[column] = value;
        }
        return newFilters;
      });
    }, 1000);
  };

  const { data } = useQuery({
    queryKey: ["tables", pageIndex, filters],
    queryFn: () => fetchData(pageIndex + 1, limit, filters),
  });

  const totalPages = Math.ceil((data?.total || 0) / limit);

  const table = useReactTable({
    data: data?.data || [],
    columns,
    getCoreRowModel: getCoreRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    manualPagination: true,
  });

  const handleJumpToPage = () => {
    const pageNumber = Number(jumpPage);
    if (!isNaN(pageNumber) && pageNumber > 0 && pageNumber <= totalPages) {
      setPageIndex(pageNumber - 1);
    } else {
      alert("Invalid page number!");
    }
  };

  return (
    <div className="container">
      <div
        className="filter-icon-container"
        onClick={() => setShowFilters(!showFilters)}
      >
        <FiFilter className="filter-icon" />
        <span className="filter-text">Filters</span>
      </div>

      <h1 className="table-title">Customer Table</h1>

      <table className="data-table">
        <thead>
          {table.getHeaderGroups().map((headerGroup) => (
            <tr key={headerGroup.id}>
              {headerGroup.headers.map((header) => (
                <th key={header.id}>
                  {flexRender(
                    header.column.columnDef.header,
                    header.getContext()
                  )}
                </th>
              ))}
            </tr>
          ))}

          {showFilters && (
            <tr>
              {table.getHeaderGroups().map((headerGroup) =>
                headerGroup.headers.map((header) => (
                  <th key={header.id}>
                    {header.id === "date" ? (
                      <div className="date-range-filter">
                        <input
                          type="date"
                          placeholder="Start Date"
                          value={inputValues[`${header.id}_start`] || ""}
                          onChange={(e) =>
                            handleFilterChange(e, `${header.id}_start`)
                          }
                          className="filter-input wide"
                        />
                        <span> to </span>
                        <input
                          type="date"
                          placeholder="End Date"
                          value={inputValues[`${header.id}_end`] || ""}
                          onChange={(e) =>
                            handleFilterChange(e, `${header.id}_end`)
                          }
                          className="filter-input wide"
                        />
                      </div>
                    ) : (
                      <input
                        type="text"
                        placeholder={`Search ${header.column.columnDef.header}`}
                        value={inputValues[header.id] || ""}
                        onChange={(e) => handleFilterChange(e, header.id)}
                        className="filter-input"
                      />
                    )}
                  </th>
                ))
              )}
            </tr>
          )}
        </thead>

        <tbody>
          {table.getRowModel().rows.map((row) => (
            <tr key={row.id}>
              {row.getVisibleCells().map((cell) => (
                <td key={cell.id}>
                  {flexRender(cell.column.columnDef.cell, cell.getContext())}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>

      <Pagination
        pageIndex={pageIndex}
        totalPages={totalPages}
        setPageIndex={setPageIndex}
      />

      <div className="pageJump">
        <input
          type="number"
          min="1"
          max={totalPages}
          value={jumpPage}
          onChange={(e) => setJumpPage(e.target.value)}
        />
        <button onClick={handleJumpToPage}>Jump To Page</button>
      </div>
    </div>
  );
};

export default ReactTable;
