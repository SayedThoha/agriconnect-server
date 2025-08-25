import { IPrescriptionInput } from "../../interfaces/commonInterface";
import { IBookedSlot } from "../../models/bookeSlotModel";
import { IExpertKyc } from "../../models/expertKycModel";
import { IExpert } from "../../models/expertModel";
import { IPrescription } from "../../models/prescriptionModel";
import { ISpecialisation } from "../../models/specialisationModel";
import { IBaseRepository } from "../base/IBaseRepository";

export interface IExpertRepository extends IBaseRepository<IExpert> {
  findByEmail(email: string): Promise<IExpert | null>;
  createKyc(expertId: string, expertDetails: IExpert): Promise<IExpertKyc>;
  getSpecialisations(): Promise<ISpecialisation[]>;
  updateExpertOtp(email: string, otp: string): Promise<IExpert | null>;
  updateExpertVerification(
    email: string,
    isVerified: boolean,
    newEmail?: string
  ): Promise<IExpert | null>;
  findExpertById(id: string): Promise<IExpert | null>;
  updateExpertProfile(
    id: string,
    updateData: Partial<IExpert>
  ): Promise<IExpert | null>;
  updatePassword(
    email: string,
    hashedPassword: string
  ): Promise<IExpert | null>;
  updateExpertById(
    expertId: string,
    updateData: Partial<IExpert>
  ): Promise<IExpert | null>;
  updateExpertOtpDetails(userId: string, otp: string): Promise<IExpert | null>;
  updateProfilePicture(expertId: string, imageUrl: string): Promise<void>;
  checkExpertStatus(expertId: string): Promise<{ blocked: boolean }>;
  getBookingDetails(expertId: string): Promise<IBookedSlot[]>;
  getExpertDashboardDetails(expertId: string): Promise<IBookedSlot[]>;
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
  getUserEmailFromSlot(slot: IBookedSlot): Promise<string | null>;
  findPrescriptionById(prescriptionId: string): Promise<IPrescription | null>;
}
