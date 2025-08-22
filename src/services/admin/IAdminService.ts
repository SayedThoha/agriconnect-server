import { ILoginResult } from "../../interfaces/adminInterface";
import { IBookedSlot } from "../../models/bookeSlotModel";
import { IExpertKyc, KycUpdateData } from "../../models/expertKycModel";
import { IExpert } from "../../models/expertModel";
import { ISpecialisation } from "../../models/specialisationModel";
import { IUser } from "../../models/userModel";

export interface IAdminService {
  validateLogin(email: string, password: string): Promise<ILoginResult>;
  getAdminDashboardDetails(): Promise<{
    userCount: number;
    expertCount: number;
    slotDetails: object;
  }>;
  getAllExperts(): Promise<IExpert[]>;
  getAllUsers(): Promise<IUser[]>;
  toggleUserBlockStatus(_id: string): Promise<void>;
  getUserDetails(_id: string): Promise<IUser>;
  searchUsers(searchTerm: string): Promise<IUser[]>;
  searchExperts(searchTerm: string): Promise<IExpert[]>;
  getAllSpecialisations(): Promise<ISpecialisation[]>;
  addSpecialisation(specialisationData: {
    specialisation: string;
  }): Promise<void>;
  editSpecialisation(data: {
    _id: string;
    specialisation: string;
  }): Promise<void>;
  deleteSpecialisation(_id: string): Promise<void>;
  toggleExpertStatus(_id: string): Promise<void>;
  getPendingKycData(): Promise<IExpertKyc[]>;
  getExpertKycDetails(expertId: string): Promise<IExpertKyc>;
  submitKycDetails(data: KycUpdateData): Promise<{ message: string }>;
  editPayOut(payOut: number): Promise<string>;
  downloadDocument(data: {
    expertId: string;
    name: unknown;
    index: number | undefined;
  }): Promise<unknown>;
  getAppointmentDetails(): Promise<IBookedSlot[]>;
}
