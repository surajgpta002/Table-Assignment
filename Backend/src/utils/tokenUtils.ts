import { FastifyReply } from "fastify";

export const generateTokens = async (userId: string, reply: FastifyReply) => {
  const accessToken = await reply.jwtSign({ id: userId }, { expiresIn: "1m" });
  const refreshToken = await reply.jwtSign({ id: userId }, { expiresIn: "7d" });

  reply.setCookie("accessToken", accessToken, {
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
