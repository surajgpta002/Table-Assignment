import { FastifyRequest, FastifyReply } from "fastify";
import { Table } from "../models/tableModel";
import { GetTablesDataQuerySchema } from "../schema/tableSchema";
import { Static } from "@sinclair/typebox";
import { faker } from "@faker-js/faker";
import { fetchTableData } from "../utils/fetchDataTable";
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
 * Get all Table and Orders Data
 */

type QueryType = Static<typeof GetTablesDataQuerySchema>;

export const getTablesData = async (
  request: FastifyRequest<{ Querystring: QueryType }>,
  reply: FastifyReply
) => {
  try {
    const result = await fetchTableData(request.query);
    return reply.send(result);
  } catch (error: any) {
    return reply.status(500).send({ error: error.message });
  }
};

/**
 * insert Bulk Table Data
 */

export const insertBulkTableData = async (
  req: FastifyRequest,
  reply: FastifyReply
): Promise<void> => {
  try {
    const orderIdSet = new Set<string>();

    const bulkData = Array.from({ length: 1000000 }, () => {
      let orderId;
      do {
        orderId = `ODR${faker.string.numeric(7)}`;
      } while (orderIdSet.has(orderId));

      orderIdSet.add(orderId);

      return {
        date: faker.date.between({ from: "2000-01-01", to: "2025-12-31" }),
        businessName: faker.company.name().substring(0, 12),
        industryType: faker.commerce.department().substring(0, 10),
        transferAmount: faker.number.int({ min: 1000, max: 99999 }),
        customerUPI: `${faker.string.alphanumeric(10)}@upi`,
        customerUTR: `UTR${faker.string.numeric(8)}`,
        orderId,
        txnId: `TXN${faker.string.numeric(4)}`,
        mdrRate: parseFloat(
          faker.number.float({ min: 10, max: 100 }).toFixed(2)
        ),
      };
    });

    await Table.insertMany(bulkData);

    reply.code(201).send({
      message: "10,00,000 records inserted successfully",
    });
  } catch (error: any) {
    reply.code(500).send({
      error: "Error inserting bulk Table Data",
      details: error.message,
    });
  }
};
