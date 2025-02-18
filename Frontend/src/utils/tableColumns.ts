import { ColumnDef } from "@tanstack/react-table";

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
