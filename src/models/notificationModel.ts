import mongoose, { Schema, Document } from "mongoose";

export interface INotification extends Document {
  userId: mongoose.Types.ObjectId;
  expertId: mongoose.Types.ObjectId;
  message: string;
  type: string; 
  isReadByUser: boolean;
  isReadByExpert: boolean;
  isClearedByUser: boolean;
  isClearedByExpert: boolean;
  createdAt: Date;
}

const notificationSchema: Schema<INotification> = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  expertId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Expert",
    required: true,
  },
  message: { type: String, required: true },
  type: { type: String, required: true },
  isReadByUser: { type: Boolean, default: false }, 
  isReadByExpert: { type: Boolean, default: false }, 
  isClearedByUser: { type: Boolean, default: false }, 
  isClearedByExpert: { type: Boolean, default: false }, 
  createdAt: { type: Date, default: Date.now },
});

export const Notification = mongoose.model("Notification", notificationSchema);
