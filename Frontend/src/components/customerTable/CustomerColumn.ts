import { ColumnDef } from "@tanstack/react-table";
import { format } from "date-fns";

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
  orderDetails: {
    productName: string;
    quantity: number;
    price: number;
  };
};

export const columns: ColumnDef<TableSchema>[] = [
  {
    accessorKey: "date",
    header: "Date",
    cell: ({ getValue }) => {
      const rawDate = getValue() as string;
      return format(new Date(rawDate), "dd-MM-yyyy");
    },
    size: 250,
  },
  { accessorKey: "businessName", header: "Business Name", size: 400 },
  { accessorKey: "industryType", header: "Industry Type", size: 180 },
  { accessorKey: "transferAmount", header: "Amount", size: 120 },
  { accessorKey: "customerUPI", header: "Customer UPI", size: 220 },
  { accessorKey: "customerUTR", header: "Customer UTR", size: 220 },
  { accessorKey: "orderId", header: "Order ID", size: 180 },
  { accessorKey: "txnId", header: "Transaction ID", size: 180 },
  { accessorKey: "mdrRate", header: "MDR Rate", size: 100 },
  {
    accessorKey: "orderDetails.productName",
    header: "Product Name",
    cell: ({ row }) => row.original.orderDetails?.productName || "N/A",
    size: 200,
  },
  {
    accessorKey: "orderDetails.quantity",
    header: "Quantity",
    cell: ({ row }) => row.original.orderDetails?.quantity || "N/A",
    size: 100,
  },
  {
    accessorKey: "orderDetails.price",
    header: "Price",
    cell: ({ row }) => row.original.orderDetails?.price || "N/A",
    size: 120,
  },
];
