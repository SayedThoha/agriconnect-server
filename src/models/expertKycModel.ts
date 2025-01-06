import { Document, Schema } from "mongoose";
import mongoose from "mongoose";
import { enumForKycVerification } from "../constants/enum";

export interface IExpertKyc extends Document {
  expertId: mongoose.Schema.Types.ObjectId;
  exp_certificate: string;
  qualification_certificate: string;
  liscence: string;
  id_proof_type: string;
  id_proof: string;
  specialisation: string;
  curr_work_details: string;
  created_time: Date;
  createdAt?: Date;
  updatedAt?: Date;
}

const expertKycschema: Schema<IExpertKyc> = new mongoose.Schema(
  {
    expertId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Expert",
      required: true,
    },
    exp_certificate: {
      type: String,
      default: enumForKycVerification[1],
    },
    qualification_certificate: {
      type: String,
      default: enumForKycVerification[1],
    },
    liscence: {
      type: String,
      default: enumForKycVerification[1],
    },
    id_proof_type: {
      type: String,
      default: enumForKycVerification[1],
    },
    id_proof: {
      type: String,
      default: enumForKycVerification[1],
    },
    specialisation: {
      type: String,
      default: enumForKycVerification[1],
    },
    curr_work_details: {
      type: String,
      default: enumForKycVerification[1],
    },
    created_time: {
      type: Date,
      default: Date.now(),
    },
  },

  { timestamps: true }
);

export const ExpertKyc = mongoose.model("expertKyccollection", expertKycschema);
