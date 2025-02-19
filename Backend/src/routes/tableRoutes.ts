import { FastifyInstance } from "fastify";
import Fastify from "fastify";
import { getTablesData, createNewData } from "../controllers/tableController";
import { GetTablesDataQuerySchema } from "../models/validationSchemas";

import { TypeBoxTypeProvider } from "@fastify/type-provider-typebox";

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
    handler: createNewData,
  });
}

export default tableRoutes;
