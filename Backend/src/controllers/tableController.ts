import { FastifyRequest, FastifyReply } from "fastify";
import { Table } from "../models/tableModel";
import { paginate } from "../utils/pagination";
import { GetTablesDataQuerySchema } from "../models/validationSchemas";
import { Static } from "@sinclair/typebox";

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
 * Get all Table Data
 */

type QueryType = Static<typeof GetTablesDataQuerySchema>;

export const getTablesData = async (
  request: FastifyRequest<{ Querystring: QueryType }>,
  reply: FastifyReply
) => {
  try {
    const { page, limit, date_start, date_end, ...filters } = request.query;

    let query: Record<string, any> = {};

    const filterObj = filters as Record<string, any>;

    for (const key in filterObj) {
      const value = filterObj[key];

      if (value !== undefined && value !== null) {
        if (typeof value === "number") {
          query[key] = value;
        } else if (typeof value === "string") {
          query[key] = { $regex: value, $options: "i" };
        }
      }
    }

    if (date_start || date_end) {
      query.date = {};
      if (date_start) query.date.$gte = new Date(date_start);
      if (date_end) query.date.$lte = new Date(date_end);
    }

    const result = await paginate(Table, {
      page,
      limit,
      query,
    });

    return reply.send(result);
  } catch (error: any) {
    return reply.status(500).send({ error: error.message });
  }
};
