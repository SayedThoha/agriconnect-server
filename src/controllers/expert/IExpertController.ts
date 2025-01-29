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
 
}