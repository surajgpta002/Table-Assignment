import Fastify from "fastify";
import dotenv from "dotenv";
import { connectDB } from "./config/db";
import tableRoutes from "./routes/routes";
import fastifyMultipart from "@fastify/multipart";
import fastifyCookie from "@fastify/cookie";
import fastifyJwt from "@fastify/jwt";
import cors from "@fastify/cors";
import { Table } from "./models/tableModel";
import { Order } from "./models/orderModel";

const syncDatabaseIndexes = async () => {
  try {
    await Table.syncIndexes();
    await Order.syncIndexes();
    console.log("Indexes synced successfully.");
  } catch (error) {
    console.error("Error syncing indexes:", error);
  }
};
syncDatabaseIndexes();

dotenv.config();
const PORT = process.env.PORT || 4000;

const server: any = Fastify({
  logger: true,
});

server.register(cors, {
  origin: process.env.FRONTEND_URI,
  methods: ["GET", "POST", "PUT", "DELETE"],
  credentials: true,
});

server.register(fastifyCookie);
server.register(fastifyJwt, {
  secret: process.env.JWT_SECRET,
  cookie: {
    cookieName: "accessToken",
    signed: false,
  },
});
server.register(fastifyMultipart);
server.register(tableRoutes);

connectDB();

server.listen({ port: Number(PORT) }, (err: any, address: any) => {
  if (err) {
    console.error(err);
    process.exit(1);
  }
  console.log(`🚀 Server running at ${address}`);
});
