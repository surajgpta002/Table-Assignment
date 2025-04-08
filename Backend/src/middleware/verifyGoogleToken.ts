import { OAuth2Client } from "google-auth-library";
import dotenv from "dotenv";

dotenv.config();

const client = new OAuth2Client(process.env.GOOGLE_CLIENT_ID);

export async function verifyGoogleToken(token: string) {
  try {
    const ticket = await client.verifyIdToken({
      idToken: token,
      audience: process.env.GOOGLE_CLIENT_ID,
    });

    const payload = ticket.getPayload();
    console.log(payload);

    if (!payload) throw new Error("Invalid Google Token");

    return {
      googleId: payload.sub,
      name: payload.name,
      email: payload.email,
    };
  } catch (error) {
    throw new Error("Google Token Verification Failed");
  }
}
