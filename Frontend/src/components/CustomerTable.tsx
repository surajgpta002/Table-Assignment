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
    orderDetails: {
      productName: string;
      quantity: number;
      price: number;
    };
  };

  const columns: ColumnDef<TableSchema>[] = [
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

  const fetchData = async (
    page: number,
    limit: number,
    filters: { [key: string]: string }
  ) => {
    const formattedFilters: { [key: string]: string } = {};

    Object.keys(filters).forEach((key) => {
      if (key.startsWith("orderDetails_")) {
        formattedFilters[key.replace("orderDetails_", "")] = filters[key];
      } else {
        formattedFilters[key] = filters[key];
      }
    });

    const queryParams = new URLSearchParams({
      page: String(page),
      limit: String(limit),
      ...formattedFilters,
    });

    const response = await axios.get(`${apiUrl}?${queryParams.toString()}`);

    const formattedData = response.data.data.map((item: any) => ({
      ...item,
      orderDetails: item.orderDetails,
    }));

    return { ...response.data, data: formattedData };
  };
  return (
    <>
      <ReactTable columns={columns} fetchData={fetchData} />
    </>
  );
}

export default CustomerTable;
