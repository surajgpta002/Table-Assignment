
import { ColumnDef } from "@tanstack/react-table";
import { format } from "date-fns";
import axios from "axios";
import ReactTable from "./RaectTable";

const apiUrl = import.meta.env.VITE_API_BASE_URL;

function CustomerTable() {
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
    {
      accessorKey: "date",
      header: "Date",
      cell: ({ getValue }) => {
        const rawDate = getValue() as string;
        return format(new Date(rawDate), "dd-MM-yyyy");
      },
      size: 150,
    },
    { accessorKey: "businessName", header: "Business Name", size: 200 },
    { accessorKey: "industryType", header: "Industry Type", size: 180 },
    { accessorKey: "transferAmount", header: "Amount", size: 120 },
    { accessorKey: "customerUPI", header: "Customer UPI", size: 220 },
    { accessorKey: "customerUTR", header: "Customer UTR", size: 220 },
    { accessorKey: "orderId", header: "Order ID", size: 180 },
    { accessorKey: "txnId", header: "Transaction ID", size: 180 },
    { accessorKey: "mdrRate", header: "MDR Rate", size: 100 },
  ];

  const fetchData = async (
    page: number,
    limit: number,
    filters: { [key: string]: string }
  ) => {
    const queryParams = new URLSearchParams({
      page: String(page),
      limit: String(limit),
      ...filters,
    });

    const response = await axios.get(`${apiUrl}?${queryParams.toString()}`);
    return response.data;
  };
  return (
    <>
      <ReactTable columns={columns} fetchData={fetchData} />
    </>
  );
}

export default CustomerTable;
