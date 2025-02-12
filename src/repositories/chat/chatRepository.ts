import { Chat, IChat } from "../../models/chatModel";
import { IMessage, Message } from "../../models/messageModel";
import BaseRepository from "../base/baseRepository";
import mongoose from "mongoose";
import { IChatRepository } from "./IChatRepository";

class ChatRepository extends BaseRepository<IChat> implements IChatRepository {
  
  constructor() {
    super(Chat);
  }

  async findChatByUserId(userId: string): Promise<IChat | null> {
    return await this.model.findOne({ user: userId }).populate([
      { path: "user", model: "User" },
      { path: "expert", model: "Expert" },
      { path: "latestMessage", populate: { path: "sender" } },
    ]);
  }

  async createChat(userId: string, expertId: string): Promise<IChat | null> {
    const chatData: Partial<IChat> = {
      chatName: "sender",
      user: new mongoose.Types.ObjectId(userId), // Convert to ObjectId
      expert: new mongoose.Types.ObjectId(expertId), // Convert to ObjectId
    };

    const createdChat = await this.create(chatData); // Use BaseRepository create method

    return this.model
      .findOne({ _id: createdChat._id })
      .populate({ path: "user", model: "User" })
      .populate({ path: "expert", model: "Expert" });
  }

  async findChatsByUserId(userId: string): Promise<IChat[]> {
    return await this.model
      .find({ users: userId }) // Ensure userId is an ObjectId
      .populate([
        { path: "user", model: "User" },
        { path: "expert", model: "Expert" },
        { path: "latestMessage", model: "Message" },
      ])
      .sort({ updatedAt: -1 });
  }

  async updateLatestMessage(
    chatId: string,
    messageId: string
  ): Promise<IChat | null> {
    return await this.model.findByIdAndUpdate(
      chatId,
      { $set: { latestMessage: messageId } },
      { new: true }
    );
  }

  async findMessagesByChatId(chatId: string): Promise<IMessage[]> {
    return await Message.find({ chat: chatId }).sort({ updatedAt: -1 });
  }

  async findChatsByExpertId(expertId: string): Promise<IChat[]> {
    return await this.model
      .find({ expert: expertId })
      .populate([
        { path: "user", model: "User" },
        { path: "expert", model: "Expert" },
        { path: "latestMessage", model: "Message" },
      ])
      .sort({ updatedAt: -1 });
  }

  // async findMessagesByChatId(chatId: string): Promise<IMessage[]> {
  //   return await Message.find({ chat: chatId }).sort({ updatedAt: -1 });
  // }

  async createMessage(
    content: string,
    chatId: string,
    senderId: string,
    senderModel: string
  ): Promise<IMessage | null> {
    const newMessage = await Message.create({
      sender: senderId,
      senderModel,
      content,
      chat: chatId,
    });

    // Update chat with the latest message
    await this.model.findByIdAndUpdate(chatId, {
      $set: { latestMessage: newMessage._id },
    });

    // Populate sender before returning
    return await Message.findById(newMessage._id).populate({
      path: "sender",
      model: senderModel,
    });
  }
  
}

export default ChatRepository;
