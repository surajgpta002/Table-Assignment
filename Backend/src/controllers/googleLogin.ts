import { FastifyRequest, FastifyReply } from "fastify";
import { generateTokens } from "../utils/generateTokens";
import User from "../models/userModel";
import { verifyGoogleToken } from "../middleware/verifyGoogleToken";

export const googleLogin = async (
  request: FastifyRequest,
  reply: FastifyReply
) => {
  const { token } = request.body as { token: string };

  if (!token) {
    return reply.status(400).send({ message: "Token is required" });
  }

  try {
    const googleUser = await verifyGoogleToken(token);

    let user: any = await User.findOne({ email: googleUser.email });

    if (!user) {
      user = new User({
        name: googleUser.name,
        email: googleUser.email,
        googleId: googleUser.googleId,
      });
      await user.save();
    } else if (!user.googleId) {
      user.googleId = googleUser.googleId;
      await user.save();
    }

    await generateTokens(user._id.toString(), reply);

    return reply.send({ message: "Login successful", user });
  } catch (error) {
    return reply.status(401).send({ message: "Invalid Google Token" });
  }
};
