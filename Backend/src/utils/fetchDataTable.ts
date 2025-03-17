import { Table } from "../models/tableModel";
import { OrderSchema } from "../schema/OrderSchema";
import { GetTablesDataQuerySchema } from "../schema/tableSchema";
import { paginateWithAggregation, PaginationResult } from "./pagination";

export const fetchTableData = async (
  queryParams: Record<string, any>,
  isExport: boolean = false
): Promise<PaginationResult<any> | any[]> => {
  const { page, limit, date_start, date_end, search, ...filters } = queryParams;

  let query: Record<string, any> = {};
  let orderQuery: Record<string, any> = {};

  const orderFields = Object.keys(OrderSchema.properties);
  const tableFields = Object.keys(GetTablesDataQuerySchema.properties);
  const filterObj = filters as Record<string, any>;

  for (const key in filterObj) {
    const value = filterObj[key];

    if (value !== undefined && value !== null) {
      if (!isNaN(Number(value))) {
        orderFields.includes(key)
          ? (orderQuery[key] = Number(value))
          : (query[key] = Number(value));
      } else if (typeof value === "string") {
        orderFields.includes(key)
          ? (orderQuery[key] = { $regex: value, $options: "i" })
          : (query[key] = { $regex: value, $options: "i" });
      }
    }
  }

  if (date_start || date_end) {
    query.date = {};
    if (date_start) query.date.$gte = new Date(date_start);
    if (date_end) query.date.$lte = new Date(date_end);
  }

  const pipeline: any[] = [];

  if (Object.keys(query).length > 0) {
    pipeline.push({ $match: query });
  }

  pipeline.push({
    $lookup: {
      from: "orders-collections",
      localField: "orderId",
      foreignField: "orderId",
      as: "orderDetails",
      pipeline: [{ $match: orderQuery }],
    },
  });

  pipeline.push({
    $unwind: { path: "$orderDetails", preserveNullAndEmptyArrays: true },
  });

  if (search) {
    const searchRegex = { $regex: search, $options: "i" };
    pipeline.push({
      $match: {
        $or: [
          ...tableFields.map((field) => ({ [field]: searchRegex })),
          ...orderFields.map((field) => ({
            [`orderDetails.${field}`]: searchRegex,
          })),
        ],
      },
    });
  }

  if (isExport) {
    pipeline.push({
      $project: {
        _id: 0,
        Date: "$date",
        Business_Name: "$businessName",
        Industry_Type: "$industryType",
        Transfer_Amount: "$transferAmount",
        Customer_UPI: "$customerUPI",
        Customer_UTR: "$customerUTR",
        Order_Id: "$orderId",
        Txn_Id: "$txnId",
        Mdr_Rate: "$mdrRate",
        Product_Name: "$orderDetails.productName",
        Quantity: "$orderDetails.quantity",
        Price: "$orderDetails.price",
      },
    });

    if (page && limit) {
      const skip = (parseInt(page) - 1) * parseInt(limit);
      pipeline.push({ $skip: skip }, { $limit: parseInt(limit) });
    }

    return await Table.aggregate(pipeline);
  }

  return await paginateWithAggregation(Table, { page, limit }, pipeline);
};
