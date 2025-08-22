import {
  FarmerBookingDetails,
  PaymentOrder,
  ServiceResponse,
} from "../../interfaces/commonInterface";
import {
  LoginResponse,
  OtpVerificationResult,
} from "../../interfaces/userInterface";
import { IExpert } from "../../models/expertModel";
import { ISpecialisation } from "../../models/specialisationModel";
import { IUser } from "../../models/userModel";
export interface IUserService {
  registerUser(userData: {
    firstName: string;
    lastName: string;
    email: string;
    password: string;
  }): Promise<ServiceResponse>;
  resendOtp(email: string): Promise<OtpVerificationResult>;
  verifyOtp(
    email: string,
    otp: string,
    role?: string,
    newEmail?: string
  ): Promise<OtpVerificationResult>;
  login(email: string, password: string): Promise<LoginResponse>;
  getUserDetails(id: string): Promise<IUser | null>;
  editUserProfile(
    id: string,
    updateData: Partial<IUser>
  ): Promise<IUser | null>;
  otpForNewEmail(userId: string, email: string): Promise<ServiceResponse>;
  editUserProfilePicture(userId: string, imageUrl: string): Promise<string>;
  checkUserStatus(userId: string): Promise<{ blocked: boolean }>;
  verifyEmailForPasswordReset(email: string): Promise<void>;
  updatePassword(
    email: string,
    password: string
  ): Promise<{ status: boolean; message: string }>;
  refreshToken(refreshToken: string): Promise<LoginResponse>;
  getSpecialisations(): Promise<ISpecialisation[]>;
  getExperts(): Promise<IExpert[]>;
  getExpertDetails(_id: string): Promise<IExpert>;
  checkSlotAvailability(
    slotId: string
  ): Promise<{ isAvailable: boolean; message: string }>;
  createPaymentOrder(fee: number): Promise<PaymentOrder>;
  bookAppointment(farmerDetails: FarmerBookingDetails): Promise<void>;
  cancelSlot(slotId: string): Promise<{ message: string }>;
}
