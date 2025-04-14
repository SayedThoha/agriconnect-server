import { IChat } from "../../models/chatModel";
import { IMessage, Message } from "../../models/messageModel";
import ChatRepository from "../../repositories/chat/chatRepository";
import { IChatService } from "./IChatService";

class ChatService implements IChatService {
  constructor(private chatRepository: ChatRepository) {}

  async getUserChat(userId: string, expertId?: string): Promise<IChat | null> {
    if (!userId) {
      throw new Error("User ID is required");
    }

    const chat = await this.chatRepository.findChatByUserId(userId);

    if (chat) {
      return chat;
    } else {
      if (!expertId) {
        throw new Error("You don't have any chats yet");
      }

      return await this.chatRepository.createChat(userId, expertId);
    }
  }

  async fetchUserChats(userId: string): Promise<IChat[]> {
    const chats = await this.chatRepository.findChatsByUserId(userId);

    for (const chat of chats) {
      if (chat.latestMessage) {
        const populatedMessage = await Message.findById(
          chat.latestMessage
        ).populate("sender");

        if (populatedMessage) {
          chat.latestMessage = populatedMessage;
        }
      }
    }

    return chats;
  }

  async sendMessage(
    content: string,
    chatId: string,
    userId: string
  ): Promise<IMessage | null> {
    if (!content || !chatId || !userId) {
      throw new Error("Invalid data passed as content, chatId, or userId");
    }

    const newMessage = await Message.create({
      sender: userId,
      senderModel: "User",
      content,
      chat: chatId,
    });

    if (!newMessage) {
      throw new Error("Message creation failed");
    }

    await this.chatRepository.updateLatestMessage(
      chatId,
      newMessage._id.toString()
    );

    return Message.findById(newMessage._id).populate({
      path: "sender",
      model: "User",
    });
  }

  async fetchAllMessages(chatId: string): Promise<IMessage[]> {
    if (!chatId) {
      throw new Error("Chat ID is required");
    }

    return this.chatRepository.findMessagesByChatId(chatId);
  }

  async fetchChatsByExpert(expertId: string): Promise<IChat[]> {
    if (!expertId) {
      throw new Error("Expert ID is required");
    }

    return this.chatRepository.findChatsByExpertId(expertId);
  }

  async fetchMessagesByChatId(chatId: string): Promise<IMessage[]> {
    if (!chatId) {
      throw new Error("Chat ID is required");
    }

    return this.chatRepository.findMessagesByChatId(chatId);
  }

  async sendExpertMessage(
    content: string,
    chatId: string,
    expertId: string
  ): Promise<IMessage | null> {
    if (!content || !chatId || !expertId) {
      throw new Error(
        "Invalid data: Content, Chat ID, and Expert ID are required."
      );
    }

    return this.chatRepository.createMessage(
      content,
      chatId,
      expertId,
      "Expert"
    );
  }
}

export default ChatService;
