/* eslint-disable  @typescript-eslint/no-explicit-any */

import { IExpert } from "../../models/expertModel"; 
import { ISpecialisation } from "../../models/specialisationModel";

export interface IExpertRepository{
    findByEmail(email: string): Promise<IExpert | null>;
    create(expertData: Partial<IExpert>): Promise<IExpert>;
    createKyc(expertId: string,expertDetails:IExpert): Promise<any>;
    getSpecialisations(): Promise<ISpecialisation[]>;
    updateExpertOtp(email: string, otp: string): Promise<IExpert | null>;
    findById(id: string): Promise<IExpert | null>;
    updateExpertProfile(id: string, updateData: Partial<IExpert>): Promise<IExpert | null> ;
    updateExpertById(expertId: string, updateData: Partial<IExpert>): Promise<IExpert | null>;
    updateProfilePicture(expertId: string, imageUrl: string): Promise<void>;

}