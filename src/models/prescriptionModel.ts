import mongoose, { Schema, Document } from "mongoose";

export interface IPrescription extends Document{
    bookedSlot:mongoose.Schema.Types.ObjectId;
    issue:string;
    prescription:string;

}
const prescriptionSchema:Schema<IPrescription> = new mongoose.Schema(
  {
    bookedSlot: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "BookedSlot",
      required: true,
    },
    issue: {
      type: String,
      required: true,
    },
    prescription: {
      type: String,
      required: true,
    },
  },
  {
    timestamps: true,
  }
);

// module.exports = mongoose.model("prescriptionCollection", prescriptionSchema);
export const Prescription=mongoose.model("Prescription",prescriptionSchema)