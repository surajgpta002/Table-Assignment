import { FastifyRequest, FastifyReply } from "fastify";
import { Order } from "../models/orderModel";
import { faker } from "@faker-js/faker";
import fs from "fs";
import path from "path";

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
 * Create Bulk  Order
 */

const filePath = path.join(__dirname, "../config/db.json");

let orderIds: string[] = JSON.parse(fs.readFileSync(filePath, "utf-8")).map(
  (o: any) => o.orderId
);

export const insertBulkOrdersData = async (
  req: FastifyRequest,
  reply: FastifyReply
): Promise<void> => {
  try {
    if (orderIds.length < 1000000) {
      reply.code(400).send({ error: "Not enough orderIds in file" });
      return;
    }

    const bulkOrderIds = orderIds.splice(0, 1000000);

    const bulkData = bulkOrderIds.map((orderId: string) => ({
      orderId,
      productName: faker.commerce.productName(),
      quantity: faker.number.int({ min: 1, max: 100 }),
      price: faker.number.int({ min: 300, max: 5000 }),
    }));

    await Order.insertMany(bulkData);

    reply.code(201).send({ message: "00,000 orders inserted successfully" });
  } catch (error: any) {
    reply
      .code(500)
      .send({ error: "Error inserting orders", details: error.message });
  }
};
