import { Request, Response } from "express";
export interface ISlotController {
  createSlot(req: Request, res: Response): Promise<void>;
  addAllSlots(req: Request, res: Response): Promise<void>;
  expertSlotDetails(req: Request, res: Response): Promise<void>;
  removeSlot(req: Request, res: Response): Promise<void>;
  getExpertSlots(req: Request, res: Response): Promise<void>;
  addSlots(req: Request, res: Response): Promise<void>;
  getSlot(req: Request, res: Response): Promise<void>;
}
