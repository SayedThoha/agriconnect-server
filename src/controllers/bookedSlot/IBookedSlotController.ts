import { Request, Response } from "express";
export interface IBookedSlotController {
  getBookingDetails(req: Request, res: Response): Promise<void>;
  getUpcomingSlot(req: Request, res: Response): Promise<void>;
  upcomingAppointment(req: Request, res: Response): Promise<void>;
  upcomingAppointmentByExpert(req: Request, res: Response): Promise<void>;
  updateUpcomingSlot(req: Request, res: Response): Promise<void>;
  updateSlotStatus(req: Request, res: Response): Promise<void>;
}
