import { FastifyInstance } from "fastify";
import Fastify from "fastify";
import {
  getTablesData,
  createNewData,
  OrderData,
} from "../controllers/tableController";
import { GetTablesDataQuerySchema } from "../schema/tableSchema";

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

  fastify.route({
    method: "POST",
    url: "/order",
    handler: OrderData,
  });
}

export default tableRoutes;
