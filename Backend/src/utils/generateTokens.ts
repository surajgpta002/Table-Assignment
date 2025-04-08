import { FastifyReply } from "fastify";

export const generateTokens = async (userId: any, reply: FastifyReply) => {
  const accessToken = await reply.jwtSign({ id: userId }, { expiresIn: "15m" });
  const refreshToken = await reply.jwtSign({ id: userId }, { expiresIn: "7d" });

  reply.setCookie("token", accessToken, {
    httpOnly: true,
    secure: false,
    sameSite: "strict",
    path: "/",
  });

  reply.setCookie("refreshToken", refreshToken, {
    httpOnly: true,
    secure: false,
    sameSite: "strict",
    path: "/",
  });
};
