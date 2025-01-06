import mongoose, { Schema, Document } from "mongoose";
import { enumForStatus } from "../constants/enum";

export interface IExpert extends Document {
  _id: mongoose.Types.ObjectId;
  firstName: string;
  lastName: string;
  email: string;
  contactno: number;
  profile_picture: string;
  specialisation: string;
  current_working_address: string;
  experience: string;
  consultation_fee: number;
  qualification_certificate: string[];
  experience_certificate: string[];
  expert_licence: string;
  identity_proof_type: string;
  identity_proof: string;
  password: string;
  kyc_verification: boolean;
  blocked: boolean;
  created_time?: Date;
  otp: string;
  otp_update_time?: Date;
  is_verified?: boolean;
  role?: string;
}

const expertSchema: Schema<IExpert> = new mongoose.Schema(
  {
    firstName: { type: String, required: true },
    lastName: { type: String, required: true },
    email: { type: String, required: true },
    contactno: { type: Number, required: true },
    profile_picture: { type: String, required: true },
    specialisation: { type: String, required: true },
    current_working_address: { type: String, required: true },
    experience: { type: String, required: true },
    consultation_fee: { type: Number, required: true },
    qualification_certificate: [{ type: String, required: true }],
    experience_certificate: [{ type: String, required: true }],
    expert_licence: { type: String, required: true },
    identity_proof_type: { type: String, required: true },
    identity_proof: { type: String, required: true },
    password: { type: String, required: true },
    kyc_verification: { type: Boolean, default: enumForStatus[1] },
    blocked: { type: Boolean, default: enumForStatus[1] },
    created_time: { type: Date, default: Date.now },
    otp: { type:String, required: true },
    otp_update_time: { type: Date, default: Date.now },
    is_verified: { type: Boolean, default: false },
    role: { type: String, default: "expert" },
  },
  { timestamps: true }
);

export const Expert = mongoose.model("Expert", expertSchema);
