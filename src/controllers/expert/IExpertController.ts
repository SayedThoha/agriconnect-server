import { Request, Response } from "express";
export interface IExpertController{

 expertRegistration(req: Request, res: Response): Promise<void>;
 getSpecialisation(req: Request, res: Response): Promise<void>;
 resendOtp(req: Request, res: Response): Promise<void>;
 verifyOtp(req: Request, res: Response): Promise<void>;
 login(req: Request, res: Response): Promise<void>;
 getExpertDetails(req: Request, res: Response): Promise<void>;
 editExpertProfile(req: Request, res: Response): Promise<void>;
 optForNewEmail(req: Request, res: Response): Promise<void>;
 editExpertProfilePicture(req:Request, res:Response): Promise<void>;
 checkExpertStatus(req: Request, res: Response): Promise<void> ;
 verifyEmailForPasswordReset(req: Request,res: Response): Promise<void>;
 updatePassword(req: Request, res: Response): Promise<void>;
 refreshToken(req: Request, res: Response): Promise<void>;
 createSlot (req: Request, res: Response): Promise<void>;
 addAllSlots(req: Request, res: Response): Promise<void>;
 expertSlotDetails(req:Request, res:Response):Promise<void>;
 removeSlot(req: Request, res: Response): Promise<void>;
 getBookingDetails(req: Request, res: Response): Promise<void>;
 getExpertDashboardDetails(req: Request, res: Response): Promise<void>;
 upcomingAppointment(req: Request, res: Response): Promise<void>;
 updateUpcomingSlot(req: Request, res: Response): Promise<void>;
 updateSlotStatus(req: Request, res: Response): Promise<void>;
 getExpertBookings (req: Request, res: Response): Promise<void>;
 addPrescription(req: Request, res: Response): Promise<void>;
 shareRoomIdThroughEmail(req: Request, res: Response): Promise<void> ;
 getPrescriptionDetails(req: Request, res: Response): Promise<void>;
}