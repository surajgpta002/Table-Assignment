import { FastifyRequest, FastifyReply } from "fastify";
import { Table, ITable } from "../models/tableModel";
import { paginate } from "../utils/pagination";

/**
 * Get all Table Data
 */

export const getTablesData = async (
  request: FastifyRequest,
  reply: FastifyReply
) => {
  try {
    const { page, limit, ...filters } = request.query as {
      page?: string;
      limit?: string;
    } & Record<string, string>;

    let query: Record<string, any> = {};


    // add request typebox schema, response schema for this ai
    const numericFields = ["transferAmount", "mdrRate"];

    for (const key in filters) {
      if (filters[key]) {
        if (numericFields.includes(key)) {
          const numValue = Number(filters[key]);
          if (!isNaN(numValue)) {
            query[key] = numValue;
          }
        } else {
          query[key] = { $regex: filters[key], $options: "i" };
        }
      }
    }
//  dont need seprate logic for filter and paginate
    if (Object.keys(filters).length > 0) {
      // Fetch filtered records
      const filteredData = await Table.find(query);
      const total = await Table.countDocuments(query);

      return reply.send({
        data: filteredData,
        total,
        page: Number(page) || 1,
        limit: Number(limit) || total,
      });
    }

    if (page && limit) {
      // Paginate only when no filters are applied
      const result = await paginate(Table, {
        page: Number(page),
        limit: Number(limit),
        query: {},
      });
      return reply.send(result);
    }

    // Default return all data
    const allData = await Table.find({});
    return reply.send({
      data: allData,
      total: allData.length,
      page: 1,
      limit: allData.length,
    });
  } catch (error: any) {
    return reply.status(500).send({ error: error.message });
  }
};

/**
 * Create a new Table Data
 */

export const createNewData = async (
  req: FastifyRequest<{ Body: ITable }>,
  reply: FastifyReply
): Promise<void> => {
  try {
    const {
      date,
      businessName,
      industryType,
      transferAmount,
      customerUPI,
      customerUTR,
      orderId,
      txnId,
      mdrRate,
    }: ITable = req.body;

    const newTableData = await Table.create({
      date,
      businessName,
      industryType,
      transferAmount,
      customerUPI,
      customerUTR,
      orderId,
      txnId,
      mdrRate,
    });

    reply.code(201).send(newTableData);
  } catch (error: any) {
    reply
      .code(500)
      .send({ error: "Error creating Table Data", details: error.message });
  }
};

// export const createNewData = async (
//   req: FastifyRequest<{ Body: ITable[] }>,
//   reply: FastifyReply
// ): Promise<void> => {
//   try {
//     const transactions: ITable[] = req.body;

//     if (!Array.isArray(transactions)) {
//       reply
//         .code(400)
//         .send({ error: "Invalid input, expected an array of transactions" });
//       return;
//     }

//     const newTableData = await Table.insertMany(transactions);

//     reply.code(201).send(newTableData);
//   } catch (error) {
//     reply
//       .code(500)
//       .send({ error: "Error creating transactions", details: error });
//   }
// };
