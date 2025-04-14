import { Http_Status_Codes } from "../../constants/httpStatusCodes";
import ChatService from "../../services/chat/chatService";
import { Request, Response } from "express";
import { IChatController } from "./IChatController";
class ChatController implements IChatController {
  constructor(private chatService: ChatService) {}

  async userAccessChat(req: Request, res: Response): Promise<void> {
    try {
      const { userId, expertId } = req.query;

      const result = await this.chatService.getUserChat(
        userId as string,
        expertId as string | undefined
      );

      if (typeof result === "string") {
        res.status(Http_Status_Codes.BAD_REQUEST).json({ message: result });
      } else {
        res.status(Http_Status_Codes.OK).json(result);
      }
    } catch (error) {
      console.error("Chat access error:", error);
      res.status(Http_Status_Codes.INTERNAL_SERVER_ERROR).json({
        message: "Internal Server Error",
      });
    }
  }

  async userFetchAllChat(req: Request, res: Response): Promise<void> {
    try {
      const { userId } = req.query;

      if (!userId || typeof userId !== "string") {
        res
          .status(Http_Status_Codes.BAD_REQUEST)
          .json({ message: "Missing or invalid userId" });
        return;
      }

      const chats = await this.chatService.fetchUserChats(userId);

      res.status(Http_Status_Codes.OK).json(chats);
    } catch (error) {
      console.error("Error in userFetchAllChat:", error);
      res
        .status(Http_Status_Codes.INTERNAL_SERVER_ERROR)
        .json({ message: "Server-side error" });
    }
  }

  async sendMessage(req: Request, res: Response): Promise<void> {
    try {
      const { content, chatId, userId } = req.body;

      const message = await this.chatService.sendMessage(
        content,
        chatId,
        userId
      );
      res.status(Http_Status_Codes.CREATED).json(message);
    } catch (error) {
      console.error("sendMessage error:", error);
      res
        .status(Http_Status_Codes.INTERNAL_SERVER_ERROR)
        .json({ message: "Server side error" });
    }
  }

  async userFetchAllMessages(req: Request, res: Response): Promise<void> {
    try {
      const { chatId } = req.query;

      if (!chatId) {
        res
          .status(Http_Status_Codes.BAD_REQUEST)
          .json({ message: "Chat ID is required" });
        return;
      }

      const messages = await this.chatService.fetchAllMessages(
        chatId as string
      );
      res.status(Http_Status_Codes.OK).json(messages);
    } catch (error) {
      console.error("fetchAllMessages error:", error);
      res
        .status(Http_Status_Codes.INTERNAL_SERVER_ERROR)
        .json({ message: "Server side error" });
    }
  }

  async getExpertChats(req: Request, res: Response): Promise<void> {
    try {
      const { expertId } = req.query;

      if (!expertId) {
        res
          .status(Http_Status_Codes.BAD_REQUEST)
          .json({ message: "Expert ID is required" });
        return;
      }

      const chats = await this.chatService.fetchChatsByExpert(
        expertId as string
      );
      res.status(Http_Status_Codes.OK).json(chats);
    } catch (error) {
      console.error("Error fetching expert chats:", error);
      res
        .status(Http_Status_Codes.INTERNAL_SERVER_ERROR)
        .json({ message: "Internal Server Error" });
    }
  }

  async getExpertMessages(req: Request, res: Response): Promise<void> {
    try {
      const { chatId } = req.query;

      if (!chatId) {
        res
          .status(Http_Status_Codes.BAD_REQUEST)
          .json({ message: "Chat ID is required" });
        return;
      }

      const messages = await this.chatService.fetchMessagesByChatId(
        chatId as string
      );

      res.status(Http_Status_Codes.OK).json(messages);
    } catch (error) {
      console.error("Error fetching messages:", error);
      res
        .status(Http_Status_Codes.INTERNAL_SERVER_ERROR)
        .json({ message: "Internal Server Error" });
    }
  }

  async expertSendMessage(req: Request, res: Response): Promise<void> {
    try {
      const { content, chatId, expertId } = req.body;

      if (!content || !chatId || !expertId) {
        res
          .status(Http_Status_Codes.BAD_REQUEST)
          .json({ message: "Invalid data passed" });
        return;
      }

      const populatedMessage = await this.chatService.sendExpertMessage(
        content,
        chatId,
        expertId
      );
      res.status(Http_Status_Codes.CREATED).json(populatedMessage);
    } catch (error) {
      console.error("Error in expertSendMessage:", error);
      res
        .status(Http_Status_Codes.INTERNAL_SERVER_ERROR)
        .json({ message: "Server side error" });
    }
  }
}

export default ChatController;
