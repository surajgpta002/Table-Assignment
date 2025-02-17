import { FastifyInstance } from "fastify";
import { getTablesData, createNewData } from "../controllers/tableController";

async function tableRoutes(fastify: FastifyInstance) {
  fastify.get("/tables", getTablesData);
  fastify.post("/table", createNewData);
}

export default tableRoutes;
