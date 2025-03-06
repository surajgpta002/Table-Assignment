import { FastifyRequest, FastifyReply } from "fastify";
import { Table } from "../models/tableModel";
import { GetTablesDataQuerySchema } from "../schema/tableSchema";
import { Static } from "@sinclair/typebox";
import { Order } from "../models/orderModel";
import { paginateWithAggregation } from "../utils/pagination";
import { OrderSchema } from "../schema/OrderSchema";

/**
 * Create a new Table Data
 */

export const createNewData = async (
  req: FastifyRequest,
  reply: FastifyReply
) => {
  try {
    const newTableData = await Table.create(req.body);

    reply.code(201).send(newTableData);
  } catch (error: any) {
    reply
      .code(500)
      .send({ error: "Error creating Table Data", details: error.message });
  }
};

/**
 * Create a new Order
 */

export const OrderData = async (req: FastifyRequest, reply: FastifyReply) => {
  try {
    const newOrderData = await Order.create(req.body);

    reply.code(201).send(newOrderData);
  } catch (error: any) {
    reply
      .code(500)
      .send({ error: "Error creating Table Data", details: error.message });
  }
};

/**
 * Get all Table and Orders Data
 */

type QueryType = Static<typeof GetTablesDataQuerySchema>;

export const getTablesData = async (
  request: FastifyRequest<{ Querystring: QueryType }>,
  reply: FastifyReply
) => {
  try {
    const { page, limit, date_start, date_end, search, ...filters } =
      request.query;

    let query: Record<string, any> = {};
    let orderQuery: Record<string, any> = {};

    const orderFields = Object.keys(OrderSchema.properties);
    const tableFields = Object.keys(GetTablesDataQuerySchema.properties);

    const filterObj = filters as Record<string, any>;

    for (const key in filterObj) {
      const value = filterObj[key];

      if (value !== undefined && value !== null) {
        if (!isNaN(Number(value))) {
          if (orderFields.includes(key)) {
            orderQuery[key] = Number(value);
          } else {
            query[key] = Number(value);
          }
        } else if (typeof value === "string") {
          if (orderFields.includes(key)) {
            orderQuery[key] = { $regex: value, $options: "i" };
          } else {
            query[key] = { $regex: value, $options: "i" };
          }
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
      $unwind: { path: "$orderDetails" },
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

    const result = await paginateWithAggregation(
      Table,
      { page, limit },
      pipeline
    );

    return reply.send(result);
  } catch (error: any) {
    return reply.status(500).send({ error: error.message });
  }
};
