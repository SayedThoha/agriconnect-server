/* eslint-disable @typescript-eslint/no-empty-object-type */
import { Request, Response } from "express";
import { FarmerBookingDetails, PaymentRequest } from "../../interfaces/commonInterface";

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
    getSpecialisation(req: Request, res: Response): Promise<void>;
    getExperts(req: Request, res: Response): Promise<void>;
    getExpertDetails(req: Request, res: Response): Promise<void>;
    getExpertSlots(req: Request, res: Response): Promise<void>;
    addSlots(req: Request, res: Response): Promise<void>;
    getSlot(req: Request, res: Response): Promise<void>;
    checkSlotAvailability(req: Request, res: Response): Promise<void>;
    createBookingPayment(req: Request<{}, {}, PaymentRequest>,res: Response): Promise<void>;
    appointmentBooking(req: Request<{}, {}, FarmerBookingDetails>,res: Response): Promise<void>;
    userDetails(req: Request, res: Response): Promise<void>
    getBookingDetails(req: Request, res: Response): Promise<void>;
    cancelSlot(req: Request, res: Response): Promise<void>;
    upcomingAppointment(req: Request, res: Response): Promise<void>;
    getUpcomingSlot(req: Request, res: Response): Promise<void>;
    getPrescriptionDetails(req: Request, res: Response): Promise<void>;
    getNotifications(req: Request, res: Response): Promise<void>;
    markNotificationAsRead(req: Request, res: Response): Promise<void>;
    clearNotifications(req: Request, res: Response): Promise<void>;
}