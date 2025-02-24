/* eslint-disable  @typescript-eslint/no-explicit-any */

import { IPrescriptionInput } from "../../interfaces/commonInterface";
import { IBookedSlot } from "../../models/bookeSlotModel";
import { IExpert } from "../../models/expertModel";
import { INotification } from "../../models/notificationModel";
import { IPrescription } from "../../models/prescriptionModel";

import { ISpecialisation } from "../../models/specialisationModel";

export interface IExpertRepository {
  findByEmail(email: string): Promise<IExpert | null>;
  createKyc(expertId: string, expertDetails: IExpert): Promise<any>;
  getSpecialisations(): Promise<ISpecialisation[]>;
  updateExpertOtp(email: string, otp: string): Promise<IExpert | null>;
  findById(id: string): Promise<IExpert | null>;
  updateExpertProfile(
    id: string,
    updateData: Partial<IExpert>
  ): Promise<IExpert | null>;
  updateExpertById(
    expertId: string,
    updateData: Partial<IExpert>
  ): Promise<IExpert | null>;
  updateProfilePicture(expertId: string, imageUrl: string): Promise<void>;
  checkExpertStatus(expertId: string): Promise<{ blocked: boolean }>;

  getBookingDetails(expertId: string): Promise<IBookedSlot[]>;
  getExpertDashboardDetails(expertId: string): Promise<IBookedSlot[]>;
  findPendingAppointmentsByExpert(expertId: string): Promise<IBookedSlot[]>;
  findSlotByIdAndUpdate(
    slotId: string,
    roomId: string
  ): Promise<IBookedSlot | null>;
  findSlotByIdAndUpdateStatus(
    slotId: string,
    status: string
  ): Promise<IBookedSlot | null>;
  findBookedSlotsByExpert(expertId: string): Promise<string[]>;

  findBookedSlotsBySlotIds(
    slotIds: string[],
    expertId: string
  ): Promise<IBookedSlot[]>;
  createPrescription(
    prescriptionData: IPrescriptionInput
  ): Promise<IPrescription>;
  updateBookedSlotWithPrescription(
    appointmentId: string,
    prescriptionId: string
  ): Promise<void>;
  findBookedSlotById(appointmentId: string): Promise<IBookedSlot | null>;

  updateRoomIdForSlot(
    slotId: string,
    roomId: string
  ): Promise<IBookedSlot | null>;

  getUserEmailFromSlot(slot: any): Promise<string | null>;
  findPrescriptionById(prescriptionId: string): Promise<IPrescription | null>;
  getNotifications(expertId: string): Promise<INotification[]>;
  markNotificationAsRead(expertId: string): Promise<void>;
  clearNotifications(expertId: string): Promise<void>;
}
