import { IChat } from "../../models/chatModel";
import { IMessage } from "../../models/messageModel";

export interface IChatRepository {
  findChatByUserId(userId: string): Promise<IChat | null>;
  createChat(userId: string, expertId: string): Promise<IChat | null>;
  findChatsByUserId(userId: string): Promise<IChat[]>;
  updateLatestMessage(chatId: string, messageId: string): Promise<IChat | null>;
  findMessagesByChatId(chatId: string): Promise<IMessage[]>;
  findChatsByExpertId(expertId: string): Promise<IChat[]>;
  createMessage(
    content: string,
    chatId: string,
    senderId: string,
    senderModel: string
  ): Promise<IMessage | null>;
  
}
