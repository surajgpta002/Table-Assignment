import { FastifyRequest, FastifyReply } from "fastify";
import { Table } from "../models/tableModel";
import { GetTablesDataQuerySchema } from "../schema/tableSchema";
import { Static } from "@sinclair/typebox";
import { Order } from "../models/orderModel";
import { faker } from "@faker-js/faker";
import fs from "fs";
import path from "path";
import { fetchTableData } from "../utils/fetchDataTable";
const XLSX = require("xlsx");

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
    const result = await fetchTableData(request.query);
    return reply.send(result);
  } catch (error: any) {
    return reply.status(500).send({ error: error.message });
  }
};

/**
 * Export all Data
 */

export const exportData = async (
  request: FastifyRequest<{ Querystring: QueryType }>,
  reply: FastifyReply
) => {
  try {
    const { exportCurrentPage, page, limit, ...filters } = request.query;

    const paginationParams = exportCurrentPage
      ? { page: Number(page), limit: Number(limit) }
      : {};

    const tableData = await fetchTableData(
      { ...paginationParams, ...filters },
      true
    );

    if (!Array.isArray(tableData) || tableData.length === 0) {
      return reply.status(404).send({ message: "No data available" });
    }

    const worksheet = XLSX.utils.json_to_sheet(tableData);

    worksheet["!cols"] = [
      { wch: 12 }, // Date
      { wch: 20 }, // Business Name
      { wch: 15 }, // Industry Type
      { wch: 16 }, // Transfer Amount
      { wch: 20 }, // Customer UPI
      { wch: 16 }, // Customer UTR
      { wch: 15 }, // Order ID
      { wch: 15 }, // Transaction ID
      { wch: 10 }, // MDR Rate
      { wch: 25 }, // Product Name
      { wch: 10 }, // Quantity
      { wch: 10 }, // Price
    ];

    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, "Exported Data");

    const buffer = XLSX.write(workbook, { bookType: "xlsx", type: "buffer" });

    reply.header(
      "Content-Type",
      "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"
    );
    reply.header(
      "Content-Disposition",
      `attachment; filename=${
        exportCurrentPage ? "FilteredData.xlsx" : "FullData.xlsx"
      }`
    );

    return reply.send(buffer);
  } catch (error: any) {
    console.error("Error exporting data:", error);
    return reply.status(500).send({ message: "Internal server error" });
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

    const bulkData = Array.from({ length: 50000 }, () => {
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
      message: "500,000 records inserted successfully",
    });
  } catch (error: any) {
    reply.code(500).send({
      error: "Error inserting bulk Table Data",
      details: error.message,
    });
  }
};

/**
 * Create Bulk  Order
 */

const filePath = path.join(__dirname, "./orderids.json");

let orderIds: string[] = JSON.parse(fs.readFileSync(filePath, "utf-8")).map(
  (o: any) => o.orderId
);

export const insertBulkOrdersData = async (
  req: FastifyRequest,
  reply: FastifyReply
): Promise<void> => {
  try {
    if (orderIds.length < 50000) {
      reply.code(400).send({ error: "Not enough orderIds in file" });
      return;
    }

    const bulkOrderIds = orderIds.splice(0, 50000);

    const bulkData = bulkOrderIds.map((orderId: string) => ({
      orderId,
      productName: faker.commerce.productName(),
      quantity: faker.number.int({ min: 1, max: 100 }),
      price: faker.number.int({ min: 300, max: 5000 }),
    }));

    await Order.insertMany(bulkData);

    reply.code(201).send({ message: "500,000 orders inserted successfully" });
  } catch (error: any) {
    reply
      .code(500)
      .send({ error: "Error inserting orders", details: error.message });
  }
};
