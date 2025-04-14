import mongoose, { Document, Schema } from "mongoose";

export interface IUser extends Document {
  _id: mongoose.Types.ObjectId;
  firstName: string;
  lastName: string;
  email: string;
  password: string;
  otp: string;
  otp_update_time?: Date;
  is_verified?: boolean;
  role?: string;
  blocked?: boolean;
  created_time?: Date;
  wallet?: number;
  profile_picture?: string;
  googleId: string;
  authProvider: string;
}

const userSchema: Schema<IUser> = new mongoose.Schema(
  {
    firstName: { type: String, required: true },
    lastName: { type: String, required: true },
    email: { type: String, required: true, unique: true, trim: true },
    password: { type: String, required: true },
    otp: { type: String, required: true },
    otp_update_time: { type: Date, default: Date.now },
    is_verified: { type: Boolean, default: false },
    role: { type: String, default: "user" },
    blocked: { type: Boolean, default: false },
    created_time: { type: Date, default: Date.now },
    wallet: { type: Number, default: 0 },
    profile_picture: { type: String, default: null },
    googleId: { type: String },
    authProvider: { type: String, default: "local" },
  },
  { timestamps: true }
);

export const User = mongoose.model("User", userSchema);
