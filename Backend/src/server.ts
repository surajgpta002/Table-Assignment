import Fastify from "fastify";
import dotenv from "dotenv";
import { connectDB } from "./config/db";
import tableRoutes from "./routes/routes";
import cors from "@fastify/cors";

dotenv.config();
const PORT = process.env.PORT || 4000;
process.env.UV_THREADPOOL_SIZE = "8";

const server = Fastify({
  logger: true,
});

server.register(cors, {
  origin: "*",
  methods: ["GET", "POST", "PUT", "DELETE"],
  allowedHeaders: ["Content-Type", "Authorization"],
});

connectDB();

server.register(tableRoutes);

server.listen({ port: Number(PORT) }, (err, address) => {
  if (err) {
    console.error(err);
    process.exit(1);
  }
  console.log(`🚀 Server running at ${address}`);
});
