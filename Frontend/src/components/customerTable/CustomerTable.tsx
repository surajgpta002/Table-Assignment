import React, { useState, useRef } from "react";
import {
  useReactTable,
  getCoreRowModel,
  getPaginationRowModel,
} from "@tanstack/react-table";
import { useQuery } from "@tanstack/react-query";
import Pagination from "./Pagination";
import GenericTable from "../GenericTable";
import JumpToColumn from "./JumpToColumn";
import ShowFilter from "./ShowFilter";
import SearchBar from "./SearchBar";
import ExportButtons from "./ExportButtons";
import FileUpload from "./FileUpload";
import { Link } from "react-router-dom";

const limit = import.meta.env.VITE_LIMIT_PER_PAGES;

const CustomerTable = ({
  columns,
  FetchDataCustomer,
}: {
  columns: any;
  FetchDataCustomer: any;
}) => {
  const [pageIndex, setPageIndex] = useState(0);
  const [showFilters, setShowFilters] = useState(false);
  const [filters, setFilters] = useState<{ [key: string]: string }>({});
  const [inputValues, setInputValues] = useState<{ [key: string]: string }>({});
  const [jumpPage, setJumpPage] = useState("1");
  const debounceTimeout = useRef<number | null>(null);

  const { data, isLoading } = useQuery({
    queryKey: ["tables", pageIndex, filters],
    queryFn: () => FetchDataCustomer(pageIndex + 1, limit, filters),
  });

  const totalPages = Math.ceil((data?.total || 0) / limit);

  const table = useReactTable({
    data: data?.data || [],
    columns,
    getCoreRowModel: getCoreRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    manualPagination: true,
  });

  let totalCount = data?.total;

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
      setPageIndex(0);
    }, 1000);
  };

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;

    if (debounceTimeout.current) {
      clearTimeout(debounceTimeout.current);
    }

    debounceTimeout.current = setTimeout(() => {
      setFilters((prev) => {
        const newFilters = { ...prev };
        if (value.trim() === "") {
          delete newFilters.search;
        } else {
          newFilters.search = value;
        }
        return newFilters;
      });
      setPageIndex(0);
    }, 500);
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
      <div>
        <div className="profile-signup">
          <button className="profile-button">
            <Link to={"/profile"}>Profile</Link>
          </button>
          <button className="signup-button">
            <Link to={"/signup"}>Signup</Link>
          </button>
        </div>

        <ExportButtons
          filters={filters}
          pageIndex={pageIndex + 1}
          limit={limit}
        />

        <FileUpload />

        <ShowFilter setShowFilters={setShowFilters} showFilters={showFilters} />

        <SearchBar handleSearchChange={handleSearchChange} />
      </div>

      <GenericTable
        handleFilterChange={handleFilterChange}
        inputValues={inputValues}
        showFilters={showFilters}
        table={table}
        isLoading={isLoading}
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
        totalCount={totalCount}
      />
    </div>
  );
};

export default CustomerTable;
