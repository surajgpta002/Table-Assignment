import { FastifyReply, FastifyRequest } from "fastify";
import User from "../models/userModel";

interface JwtPayload {
  id: string;
}

export const getProfile = async (
  request: FastifyRequest,
  reply: FastifyReply
) => {
  try {
    if (!request.user) {
      return reply.status(401).send({ error: "Unauthorized" });
    }

    const userId = (request.user as JwtPayload)?.id;

    const user = await User.findById(userId).select("-password");

    if (!user) {
      return reply.status(404).send({ error: "User not found" });
    }
    return reply.send({ message: `Welcome, User`, user });
  } catch (error) {
    return reply.status(500).send({ error: "An error occurred" });
  }
};
