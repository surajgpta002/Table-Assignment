// import React, { useState, useRef } from "react";
// import { format } from "date-fns";

// import {
//   useReactTable,
//   ColumnDef,
//   getCoreRowModel,
//   flexRender,
//   getPaginationRowModel,
// } from "@tanstack/react-table";
// import { useQuery } from "@tanstack/react-query";
// import { FiFilter } from "react-icons/fi";

// const apiUrl = import.meta.env.VITE_API_BASE_URL;
// import axios from "axios";

// const limit = import.meta.env.VITE_LIMIT_PER_PAGES;
// const no_of_pagesBox = import.meta.env.VITE_NO_OF_PAGES;

// type TableSchema = {
//   date: string;
//   businessName: string;
//   industryType: string;
//   transferAmount: number;
//   customerUPI: string;
//   customerUTR: string;
//   orderId: string;
//   txnId: string;
//   mdrRate: number;
// };

// const columns: ColumnDef<TableSchema>[] = [
//   {
//     accessorKey: "date",
//     header: "Date",
//     cell: ({ getValue }) => {
//       const rawDate = getValue() as string;
//       return format(new Date(rawDate), "dd-MM-yyyy");
//     },
//     size: 150,
//   },
//   { accessorKey: "businessName", header: "Business Name", size: 200 },
//   { accessorKey: "industryType", header: "Industry Type", size: 180 },
//   { accessorKey: "transferAmount", header: "Amount", size: 120 },
//   { accessorKey: "customerUPI", header: "Customer UPI", size: 220 },
//   { accessorKey: "customerUTR", header: "Customer UTR", size: 220 },
//   { accessorKey: "orderId", header: "Order ID", size: 180 },
//   { accessorKey: "txnId", header: "Transaction ID", size: 180 },
//   { accessorKey: "mdrRate", header: "MDR Rate", size: 100 },
// ];

// const ReactTable: React.FC = () => {
//   const fetchData = async (
//     page: number,
//     limit: number,
//     filters: { [key: string]: string }
//   ) => {
//     const queryParams = new URLSearchParams({
//       page: String(page),
//       limit: String(limit),
//       ...filters,
//     });

//     const response = await axios.get(`${apiUrl}?${queryParams.toString()}`);
//     return response.data;
//   };

//   const [pageIndex, setPageIndex] = useState(0);
//   const [showFilters, setShowFilters] = useState(false);
//   const [filters, setFilters] = useState<{ [key: string]: string }>({});
//   const [inputValues, setInputValues] = useState<{ [key: string]: string }>({});
//   const [jumpPage, setJumpPage] = useState("1");
//   const debounceTimeout = useRef<number | null>(null);

//   const handleFilterChange = (
//     e: React.ChangeEvent<HTMLInputElement>,
//     column: string
//   ) => {
//     const value = e.target.value;
//     setInputValues((prev) => ({
//       ...prev,
//       [column]: value,
//     }));

//     if (debounceTimeout.current) {
//       clearTimeout(debounceTimeout.current);
//     }

//     debounceTimeout.current = setTimeout(() => {
//       setFilters((prev) => {
//         const newFilters = { ...prev };
//         if (value.trim() === "") {
//           delete newFilters[column];
//         } else {
//           newFilters[column] = value;
//         }
//         return newFilters;
//       });
//     }, 1000);
//   };

//   const { data } = useQuery({
//     queryKey: ["tables", pageIndex, filters],
//     queryFn: () => fetchData(pageIndex + 1, limit, filters),
//   });

//   const totalPages = Math.ceil((data?.total || 0) / limit);

//   const table = useReactTable({
//     data: data?.data || [],
//     columns,
//     getCoreRowModel: getCoreRowModel(),
//     getPaginationRowModel: getPaginationRowModel(),
//     manualPagination: true,
//   });

//   const handleJumpToPage = () => {
//     const pageNumber = Number(jumpPage);
//     if (!isNaN(pageNumber) && pageNumber > 0 && pageNumber <= totalPages) {
//       setPageIndex(pageNumber - 1);
//     } else {
//       alert("Invalid page number!");
//     }
//   };

//   return (
//     <div className="container">
//       <div
//         className="filter-icon-container"
//         onClick={() => setShowFilters(!showFilters)}
//       >
//         <FiFilter className="filter-icon" />
//         <span className="filter-text">Filters</span>
//       </div>

//       <h1 className="table-title">Customer Table</h1>

//       <table className="data-table">
//         <thead>
//           {table.getHeaderGroups().map((headerGroup) => (
//             <tr key={headerGroup.id}>
//               {headerGroup.headers.map((header) => (
//                 <th key={header.id}>
//                   {flexRender(
//                     header.column.columnDef.header,
//                     header.getContext()
//                   )}
//                 </th>
//               ))}
//             </tr>
//           ))}

//           {showFilters && (
//             <tr>
//               {table.getHeaderGroups().map((headerGroup) =>
//                 headerGroup.headers.map((header) => (
//                   <th key={header.id}>
//                     {header.id === "date" ? (
//                       <div className="date-range-filter">
//                         <input
//                           type="date"
//                           placeholder="Start Date"
//                           value={inputValues[`${header.id}_start`] || ""}
//                           onChange={(e) =>
//                             handleFilterChange(e, `${header.id}_start`)
//                           }
//                           className="filter-input wide"
//                         />
//                         <span> to </span>
//                         <input
//                           type="date"
//                           placeholder="End Date"
//                           value={inputValues[`${header.id}_end`] || ""}
//                           onChange={(e) =>
//                             handleFilterChange(e, `${header.id}_end`)
//                           }
//                           className="filter-input wide"
//                         />
//                       </div>
//                     ) : (
//                       <input
//                         type="text"
//                         placeholder={`Search ${header.column.columnDef.header}`}
//                         value={inputValues[header.id] || ""}
//                         onChange={(e) => handleFilterChange(e, header.id)}
//                         className="filter-input"
//                       />
//                     )}
//                   </th>
//                 ))
//               )}
//             </tr>
//           )}
//         </thead>

//         <tbody>
//           {table.getRowModel().rows.map((row) => (
//             <tr key={row.id}>
//               {row.getVisibleCells().map((cell) => (
//                 <td key={cell.id}>
//                   {flexRender(cell.column.columnDef.cell, cell.getContext())}
//                 </td>
//               ))}
//             </tr>
//           ))}
//         </tbody>
//       </table>

//       <div className="pagination-controls">
//         <button
//           onClick={() => setPageIndex(pageIndex - 1)}
//           disabled={pageIndex === 0}
//           className="pagination-button"
//         >
//           Previous
//         </button>

//         {Array.from({ length: totalPages }, (_, i) => i + 1)
//           .slice(
//             Math.floor(pageIndex / no_of_pagesBox) * no_of_pagesBox,
//             Math.floor(pageIndex / no_of_pagesBox) * no_of_pagesBox +
//               no_of_pagesBox
//           )
//           .map((page) => (
//             <button
//               key={page}
//               onClick={() => setPageIndex(page - 1)}
//               className={`pagination-button ${
//                 pageIndex + 1 === page ? "active" : ""
//               }`}
//             >
//               {page}
//             </button>
//           ))}

//         <button
//           onClick={() => setPageIndex(pageIndex + 1)}
//           disabled={pageIndex + 1 >= totalPages}
//           className="pagination-button"
//         >
//           Next
//         </button>
//       </div>

//       <div className="pageJump">
//         <input
//           type="number"
//           min="1"
//           max={totalPages}
//           value={jumpPage}
//           onChange={(e) => setJumpPage(e.target.value)}
//         />
//         <button onClick={handleJumpToPage}>Jump To Page</button>
//       </div>
//     </div>
//   );
// };

// export default ReactTable;










// React Table**************************



// // convert this to generic component , it shouldnt have data fetching

// import React, { useState, useRef } from "react";
// import { columns } from "../utils/tableColumns";
// import {
//   useReactTable,
//   getCoreRowModel,
//   flexRender,
//   getPaginationRowModel,
// } from "@tanstack/react-table";
// import { useQuery } from "@tanstack/react-query";
// import { FiFilter } from "react-icons/fi";
// import Pagination from "./Pagination";
// import { fetchData } from "../api/api";

// const limit = import.meta.env.VITE_LIMIT_PER_PAGES;

// const ReactTable: React.FC = () => {
//   const [pageIndex, setPageIndex] = useState(0);
//   const [showFilters, setShowFilters] = useState(false);
//   const [filters, setFilters] = useState<{ [key: string]: string }>({});
//   const [inputValues, setInputValues] = useState<{ [key: string]: string }>({});
//   const [jumpPage, setJumpPage] = useState("1");
//   const debounceTimeout = useRef<number | null>(null);

//   const handleFilterChange = (
//     e: React.ChangeEvent<HTMLInputElement>,
//     column: string
//   ) => {
//     const value = e.target.value;
//     setInputValues((prev) => ({
//       ...prev,
//       [column]: value,
//     }));

//     if (debounceTimeout.current) {
//       clearTimeout(debounceTimeout.current);
//     }

//     debounceTimeout.current = setTimeout(() => {
//       setFilters((prev) => {
//         const newFilters = { ...prev };
//         if (value.trim() === "") {
//           delete newFilters[column];
//         } else {
//           newFilters[column] = value;
//         }
//         return newFilters;
//       });
//     }, 1000);
//   };

//   const { data } = useQuery({
//     queryKey: ["tables", pageIndex, filters],
//     queryFn: () => fetchData(pageIndex + 1, limit, filters),
//   });

//   const totalPages = Math.ceil((data?.total || 0) / limit);

//   const table = useReactTable({
//     data: data?.data || [],
//     columns,
//     getCoreRowModel: getCoreRowModel(),
//     getPaginationRowModel: getPaginationRowModel(),
//     manualPagination: true,
//   });

//   const handleJumpToPage = () => {
//     const pageNumber = Number(jumpPage);
//     if (!isNaN(pageNumber) && pageNumber > 0 && pageNumber <= totalPages) {
//       setPageIndex(pageNumber - 1);
//     } else {
//       alert("Invalid page number!");
//     }
//   };

//   return (
//     <div className="container">
//       <div
//         className="filter-icon-container"
//         onClick={() => setShowFilters(!showFilters)}
//       >
//         <FiFilter className="filter-icon" />
//         <span className="filter-text">Filters</span>
//       </div>

//       <h1 className="table-title">Customer Table</h1>

//       <table className="data-table">
//         <thead>
//           {table.getHeaderGroups().map((headerGroup) => (
//             <tr key={headerGroup.id}>
//               {headerGroup.headers.map((header) => (
//                 <th key={header.id}>
//                   {flexRender(
//                     header.column.columnDef.header,
//                     header.getContext()
//                   )}
//                 </th>
//               ))}
//             </tr>
//           ))}

//           {showFilters && (
//             <tr>
//               {table.getHeaderGroups().map((headerGroup) =>
//                 headerGroup.headers.map((header) => (
//                   <th key={header.id}>
//                     {header.id === "date" ? (
//                       <div className="date-range-filter">
//                         <input
//                           type="date"
//                           placeholder="Start Date"
//                           value={inputValues[`${header.id}_start`] || ""}
//                           onChange={(e) =>
//                             handleFilterChange(e, `${header.id}_start`)
//                           }
//                           className="filter-input wide"
//                         />
//                         <span> to </span>
//                         <input
//                           type="date"
//                           placeholder="End Date"
//                           value={inputValues[`${header.id}_end`] || ""}
//                           onChange={(e) =>
//                             handleFilterChange(e, `${header.id}_end`)
//                           }
//                           className="filter-input wide"
//                         />
//                       </div>
//                     ) : (
//                       <input
//                         type="text"
//                         placeholder={`Search ${header.column.columnDef.header}`}
//                         value={inputValues[header.id] || ""}
//                         onChange={(e) => handleFilterChange(e, header.id)}
//                         className="filter-input"
//                       />
//                     )}
//                   </th>
//                 ))
//               )}
//             </tr>
//           )}
//         </thead>

//         <tbody>
//           {table.getRowModel().rows.map((row) => (
//             <tr key={row.id}>
//               {row.getVisibleCells().map((cell) => (
//                 <td key={cell.id}>
//                   {flexRender(cell.column.columnDef.cell, cell.getContext())}
//                 </td>
//               ))}
//             </tr>
//           ))}
//         </tbody>
//       </table>

//       <Pagination
//         pageIndex={pageIndex}
//         totalPages={totalPages}
//         setPageIndex={setPageIndex}
//       />

//       <div className="pageJump">
//         <input
//           type="number"
//           min="1"
//           max={totalPages}
//           value={jumpPage}
//           onChange={(e) => setJumpPage(e.target.value)}
//         />
//         <button onClick={handleJumpToPage}>Jump To Page</button>
//       </div>
//     </div>
//   );
// };

// export default ReactTable;


