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

    // Build dynamic filter query
    for (const key in filters) {
      if (filters[key]) {
        query[key] = { $regex: filters[key], $options: "i" };
      }
    }

    if (page && limit) {
      const result = await paginate(Table, {
        page: Number(page),
        limit: Number(limit),
        query,
      });
      return reply.send(result);
    }

    const result = await Table.find(query);
    return reply.send(result);
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
