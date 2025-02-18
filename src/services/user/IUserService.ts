/* eslint-disable @typescript-eslint/no-empty-object-type */
import {
  FarmerBookingDetails,
  PaymentOrder,
  SlotUpdateData,
} from "../../interfaces/commonInterface";
import {
  LoginResponse,
  OtpVerificationResult,
} from "../../interfaces/userInterface";
import { IBookedSlot } from "../../models/bookeSlotModel";
import { IExpert } from "../../models/expertModel";
import { INotification } from "../../models/notificationModel";
import { IPrescription } from "../../models/prescriptionModel";
import { ISlot } from "../../models/slotModel";
import { ISpecialisation } from "../../models/specialisationModel";
import { IUser } from "../../models/userModel";

/* eslint-disable @typescript-eslint/no-explicit-any */
export interface IUserService {
  registerUser(userData: {
    firstName: string;
    lastName: string;
    email: string;
    password: string;
  }): Promise<any>;
  resendOtp(email: string): Promise<Record<string, any>>;
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
  optForNewEmail(userId: string, email: string): Promise<any>;
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
  getExpertSlots(expertId: string): Promise<ISlot[]>;
  bookSlot(slotData: SlotUpdateData): Promise<ISlot | null>;
  getSlotDetails(slotId: string): Promise<ISlot | null>;
  checkSlotAvailability(
    slotId: string
  ): Promise<{ isAvailable: boolean; message: string }>;
  createPaymentOrder(fee: number): Promise<PaymentOrder>;
  bookAppointment(farmerDetails: FarmerBookingDetails): Promise<void>;
  getBookingDetails(userId: string): Promise<IBookedSlot[]>;
  cancelSlot(slotId: string): Promise<{ message: string }>;
  getUpcomingAppointment(userId: string): Promise<IBookedSlot | {}>;
  getUpcomingSlot(appointmentId: string): Promise<IBookedSlot>;
  getPrescriptionDetails(prescriptionId: string): Promise<IPrescription>;
  getNotifications(userId: string): Promise<INotification[]>;
  markNotificationAsRead(userId: string): Promise<void>;
  clearNotifications(userId: string): Promise<void>;

}
