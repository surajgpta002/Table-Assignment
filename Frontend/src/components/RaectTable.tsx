import React, { useState, useRef } from "react";
import {
  useReactTable,
  getCoreRowModel,
  getPaginationRowModel,
} from "@tanstack/react-table";
import { useQuery } from "@tanstack/react-query";
import Pagination from "./customerTable/Pagination";
import GenericTable from "./customerTable/GenericTable";
import JumpToColumn from "./customerTable/JumpToColumn";
import ShowFilter from "./customerTable/ShowFilter";

const limit = import.meta.env.VITE_LIMIT_PER_PAGES;

const ReactTable = ({
  columns,
  fetchData,
}: {
  columns: any;
  fetchData: any;
}) => {
  const [pageIndex, setPageIndex] = useState(0);
  const [showFilters, setShowFilters] = useState(false);
  const [filters, setFilters] = useState<{ [key: string]: string }>({});
  const [inputValues, setInputValues] = useState<{ [key: string]: string }>({});
  const [jumpPage, setJumpPage] = useState("1");
  const debounceTimeout = useRef<number | null>(null);

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
      <ShowFilter setShowFilters={setShowFilters} showFilters={showFilters} />

      <h1 className="table-title">Customer Table</h1>

      <GenericTable
        handleFilterChange={handleFilterChange}
        inputValues={inputValues}
        showFilters={showFilters}
        table={table}
      />

      <Pagination
        pageIndex={pageIndex}
        totalPages={totalPages}
        setPageIndex={setPageIndex}
      />

      <JumpToColumn
        handleJumpToPage={handleJumpToPage}
        jumpPage={jumpPage}
        setJumpPage={setJumpPage}
        totalPages={totalPages}
      />
    </div>
  );
};

export default ReactTable;
