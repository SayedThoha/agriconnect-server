
import { Request, Response } from "express";
export interface IChatController {

  userAccessChat(req: Request, res: Response): Promise<void>;
  userFetchAllChat(req: Request, res: Response): Promise<void>;
  sendMessage(req: Request, res: Response): Promise<void>;
  userFetchAllMessages(req: Request, res: Response): Promise<void>;
  getExpertChats(req: Request, res: Response): Promise<void>;
  getExpertMessages(req: Request, res: Response): Promise<void>;
  expertSendMessage(req: Request, res: Response): Promise<void>
}
