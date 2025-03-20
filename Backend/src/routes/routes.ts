import { FastifyInstance } from "fastify";
import Fastify from "fastify";
import {
  getTablesData,
  insertBulkTableData,
} from "../controllers/tableController";
import { GetTablesDataQuerySchema } from "../schema/tableSchema";
import { TypeBoxTypeProvider } from "@fastify/type-provider-typebox";
import { insertBulkOrdersData } from "../controllers/orderController";
import { exportData } from "../controllers/exportController";
import { uploadExcelData } from "../controllers/importContoller";

const fastify = Fastify().withTypeProvider<TypeBoxTypeProvider>();

async function tableRoutes(fastify: FastifyInstance) {
  fastify.route({
    method: "GET",
    url: "/tables",
    schema: {
      querystring: GetTablesDataQuerySchema,
    },
    handler: getTablesData,
  });

  fastify.route({
    method: "POST",
    url: "/table",
    handler: insertBulkTableData,
  });

  fastify.route({
    method: "POST",
    url: "/order",
    handler: insertBulkOrdersData,
  });

  fastify.route({
    method: "GET",
    url: "/export",
    handler: exportData,
  });
  fastify.route({
    method: "POST",
    url: "/import",
    handler: uploadExcelData,
  });
}

export default tableRoutes;
