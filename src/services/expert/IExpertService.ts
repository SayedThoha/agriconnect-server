
/* eslint-disable @typescript-eslint/no-explicit-any */
import {
  ExpertRegistrationDTO,
  OtpVerificationResult,
} from "../../interfaces/expertInterface";
import { LoginResponse } from "../../interfaces/userInterface";
import { IBookedSlot } from "../../models/bookeSlotModel";
import { IExpert } from "../../models/expertModel";
import { ISpecialisation } from "../../models/specialisationModel";

export interface IExpertService {
  registerExpert(
    expertData: ExpertRegistrationDTO
  ): Promise<{ status: boolean; message: string }>;
  validateRegistrationData(data: Partial<ExpertRegistrationDTO>): string[];
  getSpecialisations(): Promise<ISpecialisation[]>;
  resendOtp(email: string): Promise<Record<string, any>>;
  verifyOtp(
    email: string,
    otp: string,
    role?: string,
    newEmail?: string
  ): Promise<OtpVerificationResult>;
  loginExpert(email: string, password: string): Promise<LoginResponse>;
  getExpertDetails(id: string): Promise<IExpert | null>;
  editExpertProfilePicture(expertId: string, imageUrl: string): Promise<string>;
  checkExpertStatus(expertId: string): Promise<{ blocked: boolean }>;
  verifyEmailForPasswordReset(email: string): Promise<void>;
  updatePassword(
    email: string,
    password: string
  ): Promise<{ status: boolean; message: string }>;
  refreshToken(refreshToken: string): Promise<LoginResponse>;
  getBookingDetails(expertId: string): Promise<IBookedSlot[]>;
  getExpertDashboardDetails(expertId: string): Promise<IBookedSlot[]>;
  
  getExpertBookings(expertId: string): Promise<IBookedSlot[]>;
  
  shareRoomIdService(
    slotId: string,
    roomId: string
  ): Promise<{ message: string }>;
  
}
