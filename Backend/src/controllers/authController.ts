import { FastifyRequest, FastifyReply } from "fastify";
import User from "../models/userModel";
import { generateTokens } from "../utils/tokenUtils";

// Signup
export const signup = async (request: FastifyRequest, reply: FastifyReply) => {
  const { name, email, password } = request.body as {
    name: string;
    email: string;
    password: string;
  };

  const existingUser = await User.findOne({ email });
  if (existingUser)
    return reply.status(400).send({ error: "User already exists" });

  const newUser: any = new User({ name, email, password });
  await newUser.save();

  await generateTokens(newUser._id.toString(), reply);

  return reply.send({ message: "User registered successfully" });
};

// Login
export const login = async (request: FastifyRequest, reply: FastifyReply) => {
  const { email, password } = request.body as {
    email: string;
    password: string;
  };

  const user: any = await User.findOne({ email });
  if (!user || !(await user.comparePassword(password))) {
    return reply.status(400).send({ error: "Invalid credentials" });
  }

  await generateTokens(user._id.toString(), reply);

  return reply.send({ message: "Login successful" });
};

// Logout
export const logout = async (_request: FastifyRequest, reply: FastifyReply) => {
  reply.clearCookie("accessToken");
  reply.clearCookie("refreshToken");
  return reply.send({ message: "Logout successful" });
};

// Refresh Token
export const refreshToken = async (
  request: FastifyRequest,
  reply: FastifyReply
) => {
  const { refreshToken } = request.cookies as any;

  if (!refreshToken)
    return reply.status(401).send({ error: "No refresh token provided" });

  try {
    const decoded: any = await request.server.jwt.verify(refreshToken);

    const newAccessToken = await reply.jwtSign(
      { id: decoded.id },
      { expiresIn: "1m" }
    );

    reply.setCookie("accessToken", newAccessToken, {
      httpOnly: true,
      secure: false,
      sameSite: "strict",
      path: "/",
    });

    return reply.send({
      accessToken: newAccessToken,
      message: "Access token refreshed",
    });
  } catch (error) {
    return reply
      .status(401)
      .send({ error: "Invalid or expired refresh token" });
  }
};
