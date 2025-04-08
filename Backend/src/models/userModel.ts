// import mongoose, { Schema, Document } from "mongoose";
// import bcrypt from "bcryptjs";

// interface IUser extends Document {
//   name: string;
//   email: string;
//   password: string;
//   comparePassword(password: string): Promise<boolean>;
// }

// // User Schema
// const userSchema = new Schema<IUser>({
//   name: { type: String, required: true },
//   email: { type: String, required: true, unique: true },
//   password: { type: String, required: true },
// });

// // Hashing password before saving
// userSchema.pre("save", async function (next) {
//   if (this.isModified("password")) {
//     this.password = await bcrypt.hash(this.password, 10);
//   }
//   next();
// });

// // Comparing password
// userSchema.methods.comparePassword = function (password: string) {
//   return bcrypt.compare(password, this.password);
// };

// export default mongoose.model<IUser>("User", userSchema);

import mongoose, { Schema, Document } from "mongoose";
import bcrypt from "bcryptjs";

export interface IUser extends Document {
  name: string;
  email: string;
  password?: string;
  googleId?: string;
  comparePassword(password: string): Promise<boolean>;
}

const userSchema = new Schema<IUser>({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  password: { type: String },
  googleId: { type: String, unique: true, sparse: true },
});

userSchema.pre("save", async function (next) {
  if (this.isModified("password") && this.password) {
    this.password = await bcrypt.hash(this.password, 10);
  }
  next();
});

userSchema.methods.comparePassword = function (password: string) {
  return bcrypt.compare(password, this.password || "");
};

export default mongoose.model<IUser>("User", userSchema);
