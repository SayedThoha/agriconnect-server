//userRepository.ts

import { IUserInput } from "../../interfaces/userInterface";
import { IUser, User } from "../../models/userModel";
// import { UserResponse } from "../../services/userService"
import { IUserRepository } from "./IUserRepository";

class UserRepository implements IUserRepository {
  constructor() {}

  async emailExist(email: string): Promise<IUser | null> {
    // Check if the email exists in the database
    console.log("checK email exist in user repository");
    
    return await User.findOne({ email });
  }

  async saveUser(data: IUserInput): Promise<Partial<IUser> | null> {
    // Save user data to the database
    // return await User.create(data);
    console.log('save user in user repository');
    
    const user = new User(data);
    return await user.save();
  }

  async findById(id: string): Promise<IUser | null> {
    // Find user by ID
    return await User.findById(id);
  }

  async checkEmail(email: string): Promise<IUser | null> {
    // Another email check method
    return await User.findOne({ email });
  }

  async updateUserOtp(email: string, otp: string): Promise<IUser | null> {
    return await User.findOneAndUpdate(
      { email },
      {
        $set: { otp },
        $currentDate: { otp_update_time: true },
      },
      { new: true }
    );
  }

  async findUserByEmail(email: string): Promise<IUser | null> {
    return await User.findOne({ email });
}

async updateUserVerification(
    email: string, 
    isVerified: boolean,
    newEmail?: string
): Promise<IUser | null> {
    const updateData: Partial<IUser> = {
        is_verified: isVerified
    };
    
    if (newEmail) {
        updateData.email = newEmail;
    }

    return await User.findOneAndUpdate(
        { email },
        { $set: updateData },
        { new: true }
    );
}


// async findUserByEmail(email: string): Promise<IUser | null> {
//     return await User.findOne({ email });
// }

async updateUserOtpDetails(userId: string, otp: string): Promise<IUser | null> {
    return await User.findByIdAndUpdate(
        userId,
        {
            $set: {
                otp,
                otp_update_time: new Date()
            }
        },
        { new: true }
    );
}

}

export default UserRepository;
