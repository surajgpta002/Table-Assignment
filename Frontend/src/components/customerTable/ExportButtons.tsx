import { useMutation } from "@tanstack/react-query";
import { exportDataApi } from "./api/ExportData";

const ExportButtons = ({
  filters,
  pageIndex,
  limit,
}: {
  filters: Record<string, any>;
  pageIndex: number;
  limit: number;
}) => {
  const { mutate: exportData, isPending } = useMutation({
    mutationFn: ({ exportAll }: { exportAll: boolean }) =>
      exportDataApi(filters, exportAll, pageIndex, limit),
  });

  return (
    <div className="export-import">
      {/* Export Current Page Button */}
      <button
        className="export-button"
        onClick={() => exportData({ exportAll: false })}
        disabled={isPending}
      >
        {isPending ? "Exporting..." : "Export Current Page"}
      </button>

      {/* Export All Data Button */}
      <button
        className="export-all-button"
        onClick={() => exportData({ exportAll: true })}
        disabled={isPending}
      >
        {isPending ? "Exporting..." : "Export All Data"}
      </button>
    </div>
  );
};

export default ExportButtons;
