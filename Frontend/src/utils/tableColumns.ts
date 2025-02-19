import { ColumnDef } from "@tanstack/react-table";
import { format } from "date-fns";

export type TableSchema = {
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

export const columns: ColumnDef<TableSchema>[] = [
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
