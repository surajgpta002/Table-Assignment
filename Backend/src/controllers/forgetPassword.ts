import crypto from "crypto";
import User from "../models/userModel";
import nodemailer from "nodemailer";

const frontendUrl = process.env.FRONTEND_URI;

export const forgotPassword = async (req: any, reply: any) => {
  const { email } = req.body;
  const user = await User.findOne({ email });

  if (!user) return reply.status(404).send({ message: "User not found" });

  const resetToken = user.generateResetToken();
  await user.save();

  const resetUrl = `${frontendUrl}/reset-password/${resetToken}`;

  const transporter = nodemailer.createTransport({
    service: "Gmail",
    auth: {
      user: "surajgpta002@gmail.com",
      pass: "dchf beqz jxjr jgev",
    },
  });

  const mailOptions = {
    to: user.email,
    subject: "Password Reset",
    html: `<p>You requested a password reset.</p>
           <p>Click this <a href="${resetUrl}">link</a> to reset your password.</p>`,
  };

  await transporter.sendMail(mailOptions);

  reply.send({ message: "Reset link sent to email" });
};

export const resetPassword = async (req: any, reply: any) => {
  const token = req.params.token;

  const hashedToken = crypto.createHash("sha256").update(token).digest("hex");

  const user = await User.findOne({
    resetPasswordToken: hashedToken,
    resetPasswordExpires: { $gt: new Date() },
  });

  if (!user)
    return reply.status(400).send({ message: "Invalid or expired token" });

  user.password = req.body.password;
  user.resetPasswordToken = undefined;
  user.resetPasswordExpires = undefined;

  await user.save();

  reply.send({ message: "Password reset successful" });
};
