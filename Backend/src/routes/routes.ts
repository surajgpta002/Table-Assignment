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
import {
  login,
  logout,
  refreshToken,
  signup,
} from "../controllers/authController";
import { getProfile } from "../controllers/profileController";
import { authenticate } from "../middleware/authMiddleware";
import { googleLogin } from "../controllers/googleLogin";
import { forgotPassword, resetPassword } from "../controllers/forgetPassword";

const fastify = Fastify().withTypeProvider<TypeBoxTypeProvider>();

async function tableRoutes(fastify: FastifyInstance) {
  fastify.route({
    method: "GET",
    url: "/tables",
    preHandler: authenticate,
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

  fastify.route({
    method: "POST",
    url: "/signup",
    handler: signup,
  });
  fastify.route({
    method: "POST",
    url: "/login",
    handler: login,
  });

  fastify.route({
    method: "POST",
    url: "/logout",
    handler: logout,
  });

  fastify.route({
    method: "POST",
    url: "/refresh-token",
    handler: refreshToken,
  });

  fastify.route({
    method: "GET",
    url: "/profile",
    preHandler: authenticate,
    handler: getProfile,
  });

  fastify.route({
    method: "POST",
    url: "/auth/google",
    handler: googleLogin,
  });
  fastify.route({
    method: "POST",
    url: "/forgot-password",
    handler: forgotPassword,
  });
  fastify.route({
    method: "POST",
    url: "/reset-password/:token",
    handler: resetPassword,
  });
}

export default tableRoutes;
