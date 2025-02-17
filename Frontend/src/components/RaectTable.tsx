import React, { useState } from "react";
import {
  useReactTable,
  getCoreRowModel,
  ColumnDef,
  flexRender,
  getPaginationRowModel,
} from "@tanstack/react-table";
import { useQuery } from "@tanstack/react-query";
import axios from "axios";
import { FiFilter } from "react-icons/fi";

type TableSchema = {
  date: string;
  businessName: string;
  industryType: string;
  transferAmount: number;
  customerUPI: string;
  customerUTR: string;
  orderId: string;
  txnId: string;
  mdrRate: number;
};

const columns: ColumnDef<TableSchema>[] = [
  { accessorKey: "date", header: "Date" },
  { accessorKey: "businessName", header: "Business Name" },
  { accessorKey: "industryType", header: "Industry Type" },
  { accessorKey: "transferAmount", header: "Amount" },
  { accessorKey: "customerUPI", header: "Customer UPI" },
  { accessorKey: "customerUTR", header: "Customer UTR" },
  { accessorKey: "orderId", header: "Order ID" },
  { accessorKey: "txnId", header: "Transaction ID" },
  { accessorKey: "mdrRate", header: "MDR Rate" },
];

const fetchTransactions = async (page: number, limit: number) => {
  const response = await axios.get(
    `http://localhost:8080/tables?page=${page}&limit=${limit}`
  );
  return response.data;
};

const ReactTable: React.FC = () => {
  const [pageIndex, setPageIndex] = useState(0);
  const [showFilters, setShowFilters] = useState(false);

  const limit = 15;

  const { data, error, isLoading } = useQuery({
    queryKey: ["tables", pageIndex],
    queryFn: () => fetchTransactions(pageIndex + 1, limit),
  });

  const totalPages = Math.ceil((data?.total || 0) / limit);

  const table = useReactTable({
    data: data?.data || [],
    columns,
    getCoreRowModel: getCoreRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    manualPagination: true,
  });

  if (isLoading) return <p className="loading">Loading...</p>;
  if (error) return <p className="error">Error fetching data.</p>;

  return (
    <div className="container">
      {/* Filter Toggle Icon */}
      <div className="filter-icon-container" onClick={() => setShowFilters(!showFilters)}>
        <FiFilter className="filter-icon" />
        <span className="filter-text">Filters</span>
      </div>

      <h1 className="table-title">Customer Table</h1>

      <table className="data-table">
        <thead>
          {/* Header Row */}
          {table.getHeaderGroups().map((headerGroup) => (
            <tr key={headerGroup.id}>
              {headerGroup.headers.map((header) => (
                <th key={header.id}>
                  {flexRender(header.column.columnDef.header, header.getContext())}
                </th>
              ))}
            </tr>
          ))}

          {/* Filter Input Row (Appears Below Headers) */}
          {showFilters && (
            <tr>
              {table.getHeaderGroups().map((headerGroup) =>
                headerGroup.headers.map((header) => (
                  <th key={header.id}>
                    <input
                      type="text"
                      placeholder="Search..."
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

      {/* Pagination Controls */}
      <div className="pagination-controls">
        <button
          onClick={() => setPageIndex(pageIndex - 1)}
          disabled={pageIndex === 0}
          className="pagination-button"
        >
          Previous
        </button>

        {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
          <button
            key={page}
            onClick={() => setPageIndex(page - 1)}
            className={`pagination-button ${
              pageIndex + 1 === page ? "active" : ""
            }`}
          >
            {page}
          </button>
        ))}

        <button
          onClick={() => setPageIndex(pageIndex + 1)}
          disabled={pageIndex + 1 >= totalPages}
          className="pagination-button"
        >
          Next
        </button>
      </div>
    </div>
  );
};

export default ReactTable;
