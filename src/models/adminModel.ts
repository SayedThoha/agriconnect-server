import mongoose, { Schema, Document } from "mongoose";

// Interface for Admin schema
export interface IAdmin extends Document {
  email: string;
  password: string;
  role: string;
  payOut: number;
}

const adminSchema: Schema<IAdmin> = new mongoose.Schema(
  {
    email: { type: String, required: true },
    password: { type: String, required: true },
    role: { type: String, default: "admin" },
    payOut: {
      type: Number,
      default: 100,
    },
  },
  { timestamps: true }
);

export const Admin = mongoose.model("Admin", adminSchema);
