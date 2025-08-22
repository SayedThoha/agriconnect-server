import { Document, Schema } from "mongoose";
import mongoose from "mongoose";
import { enumForKycVerification } from "../constants/enum";
import { IExpert } from "./expertModel";

export interface IExpertKyc extends Document {
  expertId: mongoose.Schema.Types.ObjectId | IExpert;
  exp_certificate: boolean;
  qualification_certificate: boolean;
  expert_licence: boolean;
  id_proof_type: boolean;
  id_proof: boolean;
  specialisation: boolean;
  current_working_address: boolean;
  created_time: Date;
  createdAt?: Date;
  updatedAt?: Date;
  address: string;
  identity_proof_name: string;
  specialisation_name: string;
}

const expertKycschema: Schema<IExpertKyc> = new mongoose.Schema(
  {
    expertId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Expert",
      required: true,
    },
    exp_certificate: {
      type: Boolean,
      default: enumForKycVerification[1],
    },
    qualification_certificate: {
      type: Boolean,
      default: enumForKycVerification[1],
    },
    expert_licence: {
      type: Boolean,
      default: enumForKycVerification[1],
    },
    id_proof_type: {
      type: Boolean,
      default: enumForKycVerification[1],
    },
    id_proof: {
      type: Boolean,
      default: enumForKycVerification[1],
    },
    specialisation: {
      type: Boolean,
      default: enumForKycVerification[1],
    },
    current_working_address: {
      type: Boolean,
      default: enumForKycVerification[1],
    },
    created_time: {
      type: Date,
      default: Date.now(),
    },

    address: {
      type: String,
    },
    identity_proof_name: {
      type: String,
    },
    specialisation_name: {
      type: String,
    },
  },

  { timestamps: true }
);

export const ExpertKyc = mongoose.model("expertKyccollection", expertKycschema);

export interface KycUpdateData {
  _id: string;
  expert_id: string;
  exp_certificate: boolean;
  qualification_certificate: boolean;
  expert_licence: boolean;
  id_proof_type: boolean;
  id_proof: boolean;
  specialisation: boolean;
  current_working_address: boolean;
}

export type KycVerificationField = keyof Omit<
  KycUpdateData,
  "_id" | "expert_id"
>;
