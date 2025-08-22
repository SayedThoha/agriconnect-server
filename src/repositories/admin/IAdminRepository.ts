import { UpdateWriteOpResult } from "mongoose";
import { IExpertDocuments } from "../../interfaces/adminInterface";
import { IAdmin } from "../../models/adminModel";
import { IBookedSlot } from "../../models/bookeSlotModel";
import { IExpertKyc } from "../../models/expertKycModel";
import { IExpert } from "../../models/expertModel";
import { ISpecialisation } from "../../models/specialisationModel";
import { IUser } from "../../models/userModel";
import { IBaseRepository } from "../base/IBaseRepository";

export interface IAdminRepository extends IBaseRepository<IAdmin> {
  findByEmail(email: string): Promise<IAdmin | null>;
  getUserCount(): Promise<number>;
  getExpertCount(): Promise<number>;
  findAllExperts(): Promise<IExpert[]>;
  findAllUsers(): Promise<IUser[]>;
  findAllSpecialisations(): Promise<ISpecialisation[]>;
  searchExperts(searchTerm: string): Promise<IExpert[]>;
  findExpertById(_id: string): Promise<IExpert | null>;
  updateExpertStatus(expert: IExpert): Promise<void>;
  createSpecialisation(specialisation: string): Promise<ISpecialisation>;
  updateSpecialisation(_id: string, specialisation: string): Promise<void>;
  deleteSpecialisation(_id: string): Promise<boolean>;
  findUserById(_id: string): Promise<IUser | null>;
  updateUserBlockStatus(_id: string, blocked: boolean): Promise<void>;
  searchUsers(searchTerm: string): Promise<IUser[]>;
  findPendingKycData(): Promise<IExpertKyc[]>;
  findKycByExpertId(expertId: string): Promise<IExpertKyc | null>;
  updateKycDetails(
    kycId: string,
    updateData: Partial<IExpertKyc>
  ): Promise<IExpertKyc | null>;
  updateExpertKycStatus(expertId: string, verified: boolean): Promise<void>;
  findByIdForDownload(expertId: string): Promise<IExpertDocuments | null>;
  updatePayOut(payOut: number): Promise<UpdateWriteOpResult>;
  getAppointmentDetails(): Promise<IBookedSlot[]>;
  getSlotDetails(): Promise<IBookedSlot[]>;
}
