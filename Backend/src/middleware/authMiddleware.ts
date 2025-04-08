import { FastifyRequest, FastifyReply } from "fastify";
import jwt from "jsonwebtoken";

export const authenticate = async (
  request: FastifyRequest,
  reply: FastifyReply
) => {
  const token = request.cookies.token;
  if (!token) {
    return reply.status(401).send({ error: "Unauthorized. Please login." });
  }
  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET!);

    request.user = decoded;
  } catch (error) {
    return reply.status(401).send({ error: "Invalid or expired token." });
  }
};
