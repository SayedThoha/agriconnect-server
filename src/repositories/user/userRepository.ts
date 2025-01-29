//userRepository.ts


import { IUser, User } from "../../models/userModel";
import BaseRepository from "../base/baseRepository";

import { IUserRepository } from "./IUserRepository";

class UserRepository extends BaseRepository<IUser> implements IUserRepository {

  constructor() {
    super(User)
  }

  // async emailExist(email: string): Promise<IUser | null> {
  //   // Check if the email exists in the database
  //   console.log("checK email exist in user repository");

  //   return await User.findOne({ email });
  // }
  async emailExist(email: string): Promise<IUser | null> {
    try {
      return await this.model.findOne({ email });
    } catch (error) {
      throw new Error(`Error checking email existence: ${error}`);
    }
  }

  // async saveUser(userData: Partial<IUser>): Promise<IUser> {
  //   const user = new User(userData);
  //   return await user.save();
  // }
  async saveUser(userData: Partial<IUser>): Promise<IUser> {
    return this.create(userData); // Using base repository create method
  }

  async findById(id: string): Promise<IUser | null> {
    // Find user by ID
    return await User.findById(id);
  }

  // async checkEmail(email: string): Promise<IUser | null> {
  //   // Another email check method
  //   return await User.findOne({ email });
  // }

  async checkEmail(email: string): Promise<IUser | null> {
    try {
      return await this.model.findOne({ email });
    } catch (error) {
      throw new Error(`Error checking email: ${error}`);
    }
  }



  // async updateUserOtp(email: string, otp: string): Promise<IUser | null> {
  //   return await User.findOneAndUpdate(
  //     { email },
  //     {
  //       $set: { otp },
  //       $currentDate: { otp_update_time: true },
  //     },
  //     { new: true }
  //   );
  // }

  async updateUserOtp(email: string, otp: string): Promise<IUser | null> {
    try {
      return await this.model.findOneAndUpdate(
        { email },
        {
          $set: { otp },
          $currentDate: { otp_update_time: true },
        },
        { new: true }
      );
    } catch (error) {
      throw new Error(`Error updating user OTP: ${error}`);
    }
  }


  // async findUserByEmail(email: string): Promise<IUser | null> {
  //   return await User.findOne({ email });
  // }

  async findUserByEmail(email: string): Promise<IUser | null> {
    try {
      return await this.model.findOne({ email });
    } catch (error) {
      throw new Error(`Error finding user by email: ${error}`);
    }
  }

  // async updateUserVerification(
  //   email: string,
  //   isVerified: boolean,
  //   newEmail?: string
  // ): Promise<IUser | null> {
  //   const updateData: Partial<IUser> = {
  //     is_verified: isVerified,
  //   };

  //   if (newEmail) {
  //     updateData.email = newEmail;
  //   }

  //   return await User.findOneAndUpdate(
  //     { email },
  //     { $set: updateData },
  //     { new: true }
  //   );
  // }

  async updateUserVerification(
    email: string,
    isVerified: boolean,
    newEmail?: string
  ): Promise<IUser | null> {
    try {
      const updateData: Partial<IUser> = {
        is_verified: isVerified,
      };

      if (newEmail) {
        updateData.email = newEmail;
      }

      return await this.model.findOneAndUpdate(
        { email },
        { $set: updateData },
        { new: true }
      );
    } catch (error) {
      throw new Error(`Error updating user verification: ${error}`);
    }
  }


  // async updateUserOtpDetails(
  //   userId: string,
  //   otp: string
  // ): Promise<IUser | null> {
  //   return await User.findByIdAndUpdate(
  //     userId,
  //     {
  //       $set: {
  //         otp,
  //         otp_update_time: new Date(),
  //       },
  //     },
  //     { new: true }
  //   );
  // }

  async updateUserOtpDetails(
    userId: string,
    otp: string
  ): Promise<IUser | null> {
    try {
      return await this.model.findByIdAndUpdate(
        userId,
        {
          $set: {
            otp,
            otp_update_time: new Date(),
          },
        },
        { new: true }
      );
    } catch (error) {
      throw new Error(`Error updating user OTP details: ${error}`);
    }
  }

  async findUserById(id: string): Promise<IUser | null> {
    try {
      // return await User.findById(id);
      
        return this.findById(id); // Using base repository findById method
      
    } catch (error) {
      console.error("Error in expert repository findById:", error);
      throw new Error("Database operation failed");
    }
  }

  // async updateUserProfile(
  //   id: string,
  //   updateData: Partial<IUser>
  // ): Promise<IUser | null> {
  //   try {
  //     return await User.findByIdAndUpdate(
  //       id,
  //       { $set: updateData },
  //       { new: true }
  //     );
  //   } catch (error) {
  //     console.error("Error in user repository updateUserProfile:", error);
  //     throw new Error("Database operation failed");
  //   }
  // }

  async updateUserProfile(
    id: string,
    updateData: Partial<IUser>
  ): Promise<IUser | null> {
    try{
    return this.update(id, updateData); // Using base repository update method
    }catch(error){
      console.error("Error in user repository updateUserProfile:", error);
      throw new Error("Database operation failed");
    }
  }



  // async updateUserById(
  //   userId: string,
  //   updateData: Partial<IUser>
  // ): Promise<IUser | null> {
  //   try {
  //     return await User.findByIdAndUpdate(
  //       userId,
  //       { $set: updateData },
  //       { new: true }
  //     );
  //   } catch (error) {
  //     console.error("Error in updateUserById:", error);
  //     throw new Error("Database operation failed");
  //   }
  // }

  async updateUserById(
    userId: string,
    updateData: Partial<IUser>
  ): Promise<IUser | null> {
    return this.update(userId, updateData); // Using base repository update method
  }


  // async updateProfilePicture(userId: string, imageUrl: string): Promise<void> {
  //   try {
  //     await User.findByIdAndUpdate(userId, {
  //       $set: { profile_picture: imageUrl },
  //     });
  //   } catch (error) {
  //     console.error("Error in updateProfilePicture repository:", error);
  //     throw new Error("Database operation failed");
  //   }
  // }

  async updateProfilePicture(userId: string, imageUrl: string): Promise<void> {
    try {
      await this.update(userId, { profile_picture: imageUrl } as Partial<IUser>);
    } catch (error) {
      throw new Error(`Error updating profile picture: ${error}`);
    }
  }



  // async checkUserStatus(userId: string): Promise<{ blocked: boolean }> {
  //   try {
  //     const user = await User.findById(userId).select("blocked");

  //     if (!user) {
  //       throw new Error("User not found");
  //     }
  //     return { blocked: user.blocked ?? false };
  //   } catch (error) {
  //     console.error("error for user check status repository", error);
  //     throw new Error("Data base operation failed");
  //   }
  // }
  
  async checkUserStatus(userId: string): Promise<{ blocked: boolean }> {
    try {
      const user = await this.findById(userId);

      if (!user) {
        throw new Error("User not found");
      }
      return { blocked: user.blocked ?? false };
    } catch (error) {
      throw new Error(`Error checking user status: ${error}`);
    }
  }


async updatePassword(email: string, hashedPassword: string): Promise<IUser | null> {
  try {
    return await this.model.findOneAndUpdate(
      { email },
      { $set: { password: hashedPassword } },
      { new: true }
    );
  } catch (error) {
    throw new Error(`Error updating password: ${error}`);
  }
}


}
export default UserRepository;
