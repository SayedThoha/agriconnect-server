/* eslint-disable  @typescript-eslint/no-explicit-any */

import { IExpert } from "../../models/expertModel"; 
import { ISpecialisation } from "../../models/specialisationModel";

export interface IExpertRepository{
    findByEmail(email: string): Promise<IExpert | null>;
    create(expertData: Partial<IExpert>): Promise<IExpert>;
    createKyc(expertId: string): Promise<any>;
    getSpecialisations(): Promise<ISpecialisation[]>;
    updateExpertOtp(email: string, otp: string): Promise<IExpert | null>;


}