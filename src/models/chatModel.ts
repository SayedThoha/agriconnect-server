import mongoose, { Document, Schema } from "mongoose";
import { IMessage } from "./messageModel";

export interface IChat extends Document {
  _id: mongoose.Types.ObjectId;
  chatName: string;
  user: mongoose.Types.ObjectId;
  expert: mongoose.Types.ObjectId;
  latestMessage: mongoose.Schema.Types.ObjectId| IMessage;
}

const chatSchema: Schema<IChat> = new mongoose.Schema(
  {
    chatName: {
      type: String,
      required: true,
    },
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    expert: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Expert",
      required: true,
    },
    latestMessage: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Message",
    },
  },
  {
    timestamps: true,
  }
);

export const Chat = mongoose.model("Chat", chatSchema);
