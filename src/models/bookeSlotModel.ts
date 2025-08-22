import mongoose, { Schema, Document } from "mongoose";
import { ISlot } from "./slotModel";

export interface IBookedSlot extends Document {
  _id: mongoose.Types.ObjectId;
  userId: mongoose.Types.ObjectId;
  slotId: mongoose.Types.ObjectId | ISlot;
  expertId: mongoose.Types.ObjectId;
  payment_method: string;
  payment_status: boolean;
  consultation_status: string;
  farmer_details: object;
  created_time: Date;
  roomId: string;
  prescription_id: mongoose.Types.ObjectId;
}

const bookedSlotSchema: Schema<IBookedSlot> = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  slotId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Slot",
    required: true,
  },
  expertId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Expert",
    required: true,
  },
  payment_method: {
    type: String,
    required: true,
  },
  payment_status: {
    type: Boolean,
    default: false,
  },
  consultation_status: {
    type: String,
    default: "pending",
  },
  farmer_details: {
    name: {
      type: String,
    },
    email: {
      type: String,
    },
    age: {
      type: Number,
    },
    gender: {
      type: String,
    },
    address: {
      type: String,
    },
    reason_for_visit: {
      type: String,
    },
  },
  created_time: {
    type: Date,
    default: Date.now(),
  },
  roomId: {
    type: String,
  },
  prescription_id: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Prescription",
  },
});

export const BookedSlot = mongoose.model("BookedSlot", bookedSlotSchema);
