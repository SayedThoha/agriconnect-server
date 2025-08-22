import { IBookedSlot } from "../../models/bookeSlotModel";
import { IExpert } from "../../models/expertModel";
import { ISlot } from "../../models/slotModel";
import { ISpecialisation } from "../../models/specialisationModel";
import { IUser } from "../../models/userModel";
import { IBaseRepository } from "../base/IBaseRepository";

export interface IUserRepository extends IBaseRepository<IUser> {
  emailExist(email: string): Promise<IUser | null>;
  saveUser(data: Partial<IUser>): Promise<Partial<IUser> | null>;
  checkEmail(email: string): Promise<IUser | null>;
  updateUserOtp(email: string, otp: string): Promise<IUser | null>;
  findUserById(id: string): Promise<IUser | null>;
  updateUserProfile(
    id: string,
    updateData: Partial<IUser>
  ): Promise<IUser | null>;
  findUserByEmail(email: string): Promise<IUser | null>;
  updateUserVerification(
    email: string,
    isVerified: boolean,
    newEmail?: string
  ): Promise<IUser | null>;
  updateUserById(
    userId: string,
    updateData: Partial<IUser>
  ): Promise<IUser | null>;
  updateProfilePicture(userId: string, imageUrl: string): Promise<void>;
  updateUserOtpDetails(userId: string, otp: string): Promise<IUser | null>;
  checkUserStatus(userId: string): Promise<{ blocked: boolean }>;
  updatePassword(email: string, hashedPassword: string): Promise<IUser | null>;
  getSpecialisations(): Promise<ISpecialisation[]>;
  getExperts(): Promise<IExpert[]>;
  getExpertDetailsById(expertId: string): Promise<IExpert | null>;
  findSlotById(slotId: string): Promise<ISlot | null>;
  findBookedSlot(slotId: string): Promise<IBookedSlot | null>;
  updateSlotBookingStatus(
    slotId: string,
    booked: boolean
  ): Promise<ISlot | null>;
  createBookedSlot(bookingDetails: object): Promise<IBookedSlot>;
  findBookedSlotsByUser(userId: string): Promise<IBookedSlot[]>;
  updateWallet(userId: string, amount: number): Promise<IUser | null>;
  findSlotByIdAndUpdate(
    slotId: string,
    updateData: object
  ): Promise<ISlot | null>;
  findOneBookedSlotAndUpdate(
    filter: object,
    updateData: object
  ): Promise<IBookedSlot | null>;
  findBookedSlotById(appointmentId: string): Promise<IBookedSlot | null>;
  updateUserWallet(userId: string, amount: number): Promise<void>;
}
