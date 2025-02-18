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

const ReactTable: React.FC = () => {
  const limit = import.meta.env.VITE_LIMIT_PER_PAGES;
  const [pageIndex, setPageIndex] = useState(0);
  const [showFilters, setShowFilters] = useState(false);
  const [filters, setFilters] = useState<{ [key: string]: string }>({});
  const [inputValues, setInputValues] = useState<{ [key: string]: string }>({});
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
      setFilters((prev) => ({
        ...prev,
        [column]: value,
      }));
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
                    <input
                      type="text"
                      placeholder={`Search ${header.column.columnDef.header}`}
                      value={inputValues[header.id] || ""}
                      onChange={(e) => handleFilterChange(e, header.id)}
                      className="filter-input"
                    />
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
    </div>
  );
};

export default ReactTable;
