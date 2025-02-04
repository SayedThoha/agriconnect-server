import mongoose, { Schema, Document } from "mongoose";

export interface ISlot extends Document {
  _id: mongoose.Types.ObjectId;
  expertId: mongoose.Types.ObjectId;
  time: Date;
  booked: boolean;
  bookingAmount: number;
  adminPaymentAmount: number;
  cancelled: boolean;
  created_time: Date;
}

const slotschema: Schema<ISlot> = new mongoose.Schema({
  expertId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Expert",
    required: true,
  },
  time: {
    type: Date,
    required: true,
  },
  booked: {
    type: Boolean,
    default: false,
  },

  bookingAmount: {
    type: Number,
    required: true,
  },
  adminPaymentAmount: {
    type: Number,
    required: true,
  },
  cancelled: {
    type: Boolean,
    default: false,
  },
  created_time: {
    type: Date,
    default: Date.now(),
  },
});


export const Slot = mongoose.model("Slot", slotschema);
