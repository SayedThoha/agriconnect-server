import { Request, Response } from "express";

export interface IUserController{
    registerUser(req: Request, res: Response): Promise<void>;
    resendOtp(req: Request, res: Response): Promise<void>;
    verifyOtp(req: Request, res: Response): Promise<void>;
    login(req: Request, res: Response): Promise<void>;
    getUserDetails(req: Request, res: Response): Promise<void>;
    editUserProfile(req: Request, res: Response): Promise<void>;
    optForNewEmail(req: Request, res: Response): Promise<void>;
    editUserProfilePicture(req: Request, res: Response): Promise<void>;
    checkUserStatus(req: Request, res: Response): Promise<void>;
    verifyEmailForPasswordReset( req: Request,res: Response):Promise<void>;
    updatePassword (req: Request, res: Response): Promise<void>;
    refreshToken(req: Request, res: Response): Promise<void>;
}