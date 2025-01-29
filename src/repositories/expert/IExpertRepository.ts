/* eslint-disable  @typescript-eslint/no-explicit-any */

import { IExpert } from "../../models/expertModel"; 
import { ISlot } from "../../models/slotModel";
import { ISpecialisation } from "../../models/specialisationModel";

export interface IExpertRepository{
    
    findByEmail(email: string): Promise<IExpert | null>;
    createKyc(expertId: string,expertDetails:IExpert): Promise<any>;
    getSpecialisations(): Promise<ISpecialisation[]>;
    updateExpertOtp(email: string, otp: string): Promise<IExpert | null>;
    findById(id: string): Promise<IExpert | null>;
    updateExpertProfile(id: string, updateData: Partial<IExpert>): Promise<IExpert | null> ;
    updateExpertById(expertId: string, updateData: Partial<IExpert>): Promise<IExpert | null>;
    updateProfilePicture(expertId: string, imageUrl: string): Promise<void>;
    checkExpertStatus(expertId: string): Promise<{ blocked: boolean }>;
    findSlotByExpertIdAndTime(expertId: string, time: Date): Promise<ISlot | null>;
    createSlot(slotData: Partial<ISlot>): Promise<ISlot>;
    findAdminSettings(): Promise<any[]>;

}