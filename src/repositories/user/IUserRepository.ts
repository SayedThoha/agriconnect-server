
//IUserRepository.ts

import { SlotUpdateData } from "../../interfaces/commonInterface";
import { IBookedSlot } from "../../models/bookeSlotModel";
import { IExpert } from "../../models/expertModel";
import { INotification } from "../../models/notificationModel";
import { IPrescription } from "../../models/prescriptionModel";
import { ISlot } from "../../models/slotModel";
import { ISpecialisation } from "../../models/specialisationModel";
import { IUser } from "../../models/userModel";

export interface IUserRepository {
     emailExist(email: string): Promise<IUser | null>;
     saveUser(data: IUser): Promise<Partial<IUser> | null>;
     checkEmail(email: string): Promise<IUser | null>;
     findById(id: string): Promise<IUser | null>;
     updateUserOtp(email: string, otp: string): Promise<IUser | null>;
     findUserById(id: string): Promise<IUser | null> ;
     updateUserProfile(id: string,updateData: Partial<IUser> ): Promise<IUser | null>;
     updateProfilePicture(userId: string, imageUrl: string): Promise<void>;
     checkUserStatus(userId: string): Promise<{ blocked: boolean }>;
     updatePassword(email: string, hashedPassword: string): Promise<IUser | null>;
     getSpecialisations():Promise<ISpecialisation[]>;
     getExperts(): Promise<IExpert[]>;
     getExpertDetailsById(expertId: string): Promise<IExpert | null>;
     updateSlotBooking(data: SlotUpdateData): Promise<ISlot | null>;
     findSlotById(slotId: string): Promise<ISlot | null>;
     findBookedSlot(slotId: string): Promise<IBookedSlot | null>;
     updateSlotBookingStatus(slotId: string, booked: boolean): Promise<ISlot | null>;
     createBookedSlot(bookingDetails: object): Promise<IBookedSlot>;
     findBookedSlotsByUser(userId: string): Promise<IBookedSlot[]>;
     updateWallet(userId:string, amount:number): Promise<IUser | null> ;
     findSlotByIdAndUpdate(slotId:string, updateData:object):Promise<ISlot|null>;
     findOneBookedSlotAndUpdate(filter:object, updateData:object):Promise<IBookedSlot|null>;
     findPendingAppointmentsByUser(userId: string):Promise<IBookedSlot[]>;
     findBookedSlotById(appointmentId: string):Promise<IBookedSlot|null>;
     findPrescriptionById(prescriptionId: string):Promise<IPrescription|null>;
     updateUserWallet(userId: string, amount: number): Promise<void>;
     getNotifications(userId: string): Promise<INotification[]>;
     markNotificationAsRead(userId: string): Promise<void>;
     clearNotifications(userId: string): Promise<void>;
}

