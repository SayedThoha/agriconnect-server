import { IChat } from "../../models/chatModel";
import { IMessage } from "../../models/messageModel";
export interface IChatService {
  getUserChat(userId: string, expertId?: string): Promise<IChat | null>;
  fetchUserChats(userId: string): Promise<IChat[]>;
  sendMessage(
    content: string,
    chatId: string,
    userId: string
  ): Promise<IMessage | null>;
  fetchAllMessages(chatId: string): Promise<IMessage[]>;
  fetchChatsByExpert(expertId: string): Promise<IChat[]>;
  fetchMessagesByChatId(chatId: string): Promise<IMessage[]>;
  sendExpertMessage(
    content: string,
    chatId: string,
    expertId: string
  ): Promise<IMessage | null>;
  
}
