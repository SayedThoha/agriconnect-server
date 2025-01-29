
//IUserRepository.ts
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
     checkUserStatus(userId: string): Promise<{ blocked: boolean }>
     updatePassword(email: string, hashedPassword: string): Promise<IUser | null>
}
