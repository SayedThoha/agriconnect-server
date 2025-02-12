/* eslint-disable  @typescript-eslint/no-explicit-any */

import {
  IPrescriptionInput,
  ISlotData,
} from "../../interfaces/commonInterface";
import { IBookedSlot } from "../../models/bookeSlotModel";
import { IExpert } from "../../models/expertModel";
import { IPrescription } from "../../models/prescriptionModel";
import { ISlot } from "../../models/slotModel";
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
  findSlotByExpertIdAndTime(
    expertId: string,
    time: Date
  ): Promise<ISlot | null>;
  createSlot(slotData: Partial<ISlot>): Promise<ISlot>;
  findAdminSettings(): Promise<any[]>;
  createMultipleSlots(slots: ISlotData[]): Promise<ISlot[]>;
  findSlotsByExpertId(expertId: string, currentTime: Date): Promise<ISlot[]>;
  findSlotById(slotId: string): Promise<ISlot | null>;
  deleteSlotById(slotId: string): Promise<ISlot | null>;
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
}
