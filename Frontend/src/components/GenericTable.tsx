import { flexRender } from "@tanstack/react-table";

function GenericTable({
  table,
  showFilters,
  inputValues,
  handleFilterChange,
  isLoading,
}: {
  table: any;
  showFilters: any;
  inputValues: any;
  handleFilterChange: any;
  isLoading: any;
}) {
  return (
    <table className="data-table bg-red-900">
      <thead>
        {table.getHeaderGroups().map((headerGroup: any) => (
          <tr key={headerGroup.id}>
            {headerGroup.headers.map((header: any) => (
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
            {table.getHeaderGroups().map((headerGroup: any) =>
              headerGroup.headers.map((header: any) => (
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
        {isLoading ? (
          <tr>
            <td colSpan={table.getHeaderGroups()[0]?.headers.length || 1}>
              <h1>Loading....</h1>
            </td>
          </tr>
        ) : (
          table.getRowModel().rows.map((row: any) => (
            <tr key={row.id}>
              {row.getVisibleCells().map((cell: any) => (
                <td key={cell.id}>
                  {flexRender(cell.column.columnDef.cell, cell.getContext())}
                </td>
              ))}
            </tr>
          ))
        )}
      </tbody>
    </table>
  );
}

export default GenericTable;
