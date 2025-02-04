/* eslint-disable @typescript-eslint/no-explicit-any */
import { IExpertDocuments } from "../../interfaces/adminInterface";
import { IAdmin } from "../../models/adminModel";
import { IBookedSlot } from "../../models/bookeSlotModel";
import { IExpertKyc } from "../../models/expertKycModel";
import { IExpert } from "../../models/expertModel";
import { ISpecialisation } from "../../models/specialisationModel";
import { IUser } from "../../models/userModel";

export interface IAdminRepository {
  findByEmail(email: string): Promise<IAdmin | null>;
  getUserCount(): Promise<number>;
  getExpertCount(): Promise<number>;
  findAllExperts(): Promise<IExpert[]>;
  findAllUsers(): Promise<IUser[]>;
  findAllSpecialisations(): Promise<ISpecialisation[]>;
  createSpecialisation(specialisation: string): Promise<ISpecialisation>;
  updateSpecialisation(_id: string, specialisation: string): Promise<void>;
  deleteSpecialisation(_id: string): Promise<boolean>;
  findUserById(_id: string): Promise<IUser | null>;
  updateUserBlockStatus(_id: string, blocked: boolean): Promise<void>;
  searchUsers(searchTerm: string): Promise<IUser[]>;
  findPendingKycData(): Promise<IExpertKyc[]>;
  updateKycDetails(
    kycId: string,
    updateData: Partial<IExpertKyc>
  ): Promise<IExpertKyc | null>;
  updateExpertKycStatus(expertId: string, verified: boolean): Promise<void>;
  findByIdForDownload(expertId: string): Promise<IExpertDocuments | null>;
  updatePayOut(payOut: number): Promise<any>;
  getAppointmentDetails(): Promise<IBookedSlot[]>;
  getSlotDetails(): Promise<IBookedSlot[]>;
}
