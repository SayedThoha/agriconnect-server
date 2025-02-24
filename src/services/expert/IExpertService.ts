/* eslint-disable @typescript-eslint/no-empty-object-type */
/* eslint-disable @typescript-eslint/no-explicit-any */
import {
  ExpertRegistrationDTO,
  OtpVerificationResult,
} from "../../interfaces/expertInterface";
import { LoginResponse } from "../../interfaces/userInterface";
import { IBookedSlot } from "../../models/bookeSlotModel";
import { IExpert } from "../../models/expertModel";
import { INotification } from "../../models/notificationModel";
import { IPrescription } from "../../models/prescriptionModel";

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
  getUpcomingAppointment(expertId: string): Promise<IBookedSlot | {}>;
  updateUpcomingSlot(
    appointmentId: string,
    roomId: string
  ): Promise<IBookedSlot>;
  updateSlotStatus(appointmentId: string, status: string): Promise<IBookedSlot>;
  getExpertBookings(expertId: string): Promise<IBookedSlot[]>;
  addPrescription(
    appointmentId: string,
    issue: string,
    prescription: string
  ): Promise<IPrescription>;

  shareRoomIdService(
    slotId: string,
    roomId: string
  ): Promise<{ message: string }>;
  getPrescriptionDetails(prescriptionId: string): Promise<IPrescription>;
  getNotifications(expertId: string): Promise<INotification[]>;
  markNotificationAsRead(expertId: string): Promise<void>;
  clearNotifications(expertId: string): Promise<void>;
}
