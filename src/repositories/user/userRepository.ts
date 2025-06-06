import { Expert, IExpert } from "../../models/expertModel";
import {
  ISpecialisation,
  Specialisation,
} from "../../models/specialisationModel";
import { IUser, User } from "../../models/userModel";
import BaseRepository from "../base/baseRepository";
import { IUserRepository } from "./IUserRepository";
import { ISlot, Slot } from "../../models/slotModel";
import { BookedSlot, IBookedSlot } from "../../models/bookeSlotModel";

class UserRepository extends BaseRepository<IUser> implements IUserRepository {
  constructor() {
    super(User);
  }

  async emailExist(email: string): Promise<IUser | null> {
    try {
      return await this.model.findOne({ email });
    } catch (error) {
      throw new Error(`Error checking email existence: ${error}`);
    }
  }

  async saveUser(userData: Partial<IUser>): Promise<IUser> {
    return this.create(userData);
  }

  async checkEmail(email: string): Promise<IUser | null> {
    try {
      return await this.model.findOne({ email });
    } catch (error) {
      throw new Error(`Error checking email: ${error}`);
    }
  }

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

  async findUserByEmail(email: string): Promise<IUser | null> {
    try {
      return await this.model.findOne({ email });
    } catch (error) {
      throw new Error(`Error finding user by email: ${error}`);
    }
  }

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
      return this.findById(id);
    } catch (error) {
      console.error("Error in expert repository findById:", error);
      throw new Error("Database operation failed");
    }
  }

  async updateUserProfile(
    id: string,
    updateData: Partial<IUser>
  ): Promise<IUser | null> {
    try {
      return this.update(id, updateData);
    } catch (error) {
      console.error("Error in user repository updateUserProfile:", error);
      throw new Error("Database operation failed");
    }
  }

  async updateUserById(
    userId: string,
    updateData: Partial<IUser>
  ): Promise<IUser | null> {
    return this.update(userId, updateData);
  }

  async updateProfilePicture(userId: string, imageUrl: string): Promise<void> {
    try {
      await this.update(userId, {
        profile_picture: imageUrl,
      } as Partial<IUser>);
    } catch (error) {
      throw new Error(`Error updating profile picture: ${error}`);
    }
  }

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

  async updatePassword(
    email: string,
    hashedPassword: string
  ): Promise<IUser | null> {
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

  async getSpecialisations(): Promise<ISpecialisation[]> {
    return await Specialisation.find();
  }

  async getExperts(): Promise<IExpert[]> {
    try {
      const experts = await Expert.find({
        kyc_verification: true,
        blocked: false,
        is_verified: true,
      });
      return experts;
    } catch (error) {
      console.error("Error in findAllExperts repository:", error);
      throw error;
    }
  }

  async getExpertDetailsById(expertId: string): Promise<IExpert | null> {
    try {
      const expert = await Expert.findById(expertId);
      return expert;
    } catch (error) {
      console.error("Error in findExpertDetails repository:", error);
      throw error;
    }
  }

  async findSlotById(slotId: string): Promise<ISlot | null> {
    try {
      const slot = await Slot.findById(slotId).populate("expertId").exec();

      return slot;
    } catch (error) {
      console.error("Error in slot repository findSlotById:", error);
      throw error;
    }
  }

  async findBookedSlot(slotId: string): Promise<IBookedSlot | null> {
    try {
      const slot = await BookedSlot.findOne({ slotId });
      return slot;
    } catch (error) {
      console.error("Error in bookedSlot repository findBookedSlot:", error);
      throw error;
    }
  }

  async updateSlotBookingStatus(
    slotId: string,
    booked: boolean
  ): Promise<ISlot | null> {
    try {
      return await Slot.findByIdAndUpdate(
        slotId,
        { $set: { booked } },
        { new: true }
      );
    } catch (error) {
      console.error("Error in updateSlotBookingStatus:", error);
      throw error;
    }
  }

  async createBookedSlot(bookingDetails: object): Promise<IBookedSlot> {
    try {
      return await BookedSlot.create(bookingDetails);
    } catch (error) {
      console.error("Error in createBookedSlot:", error);
      throw error;
    }
  }

  async findBookedSlotsByUser(userId: string): Promise<IBookedSlot[]> {
    try {
      const bookedSlots = await BookedSlot.find({ userId })
        .populate({
          path: "slotId",
          populate: {
            path: "expertId",
          },
        })
        .populate("userId")
        .exec();

      return bookedSlots;
    } catch (error) {
      console.error("Error in findBookedSlotsByUser:", error);
      throw error;
    }
  }

  async updateWallet(userId: string, amount: number): Promise<IUser | null> {
    return await User.findByIdAndUpdate(userId, { $inc: { wallet: amount } });
  }

  async findSlotByIdAndUpdate(
    slotId: string,
    updateData: object
  ): Promise<ISlot | null> {
    return await Slot.findByIdAndUpdate(
      slotId,
      { $set: updateData },
      { new: true }
    );
  }

  async findOneBookedSlotAndUpdate(
    filter: object,
    updateData: object
  ): Promise<IBookedSlot | null> {
    return await BookedSlot.findOneAndUpdate(
      filter,
      { $set: updateData },
      { new: true }
    );
  }

  async findBookedSlotById(appointmentId: string): Promise<IBookedSlot | null> {
    return await BookedSlot.findById(appointmentId);
  }

  async updateUserWallet(userId: string, amount: number): Promise<void> {
    await User.findByIdAndUpdate(userId, { $inc: { wallet: amount } });
  }
}
export default UserRepository;
