/* eslint-disable @typescript-eslint/no-explicit-any */
import { IExpertRepository } from "./IExpertRepository";
import { Specialisation } from "../../models/specialisationModel";
import { Expert, IExpert } from "../../models/expertModel";
import { ExpertKyc, IExpertKyc } from "../../models/expertKycModel";
import BaseRepository from "../base/baseRepository";
import { ISlot, Slot } from "../../models/slotModel";
import { Admin } from "../../models/adminModel";

class ExpertRepository
  extends BaseRepository<IExpert>
  implements IExpertRepository
{
  constructor() {
    super(Expert);
  }

  async getSpecialisations() {
    console.log("get specialisation serverside");
    return await Specialisation.find();
  }

  async findByEmail(email: string): Promise<IExpert | null> {
    try {
      return await Expert.findOne({ email });
    } catch (error) {
      console.log(error);
      throw new Error(`Error finding expert by email: ${error}`);
    }
  }

 

  async createKyc(
    expertId: string,
    expertDetails: IExpert
  ): Promise<IExpertKyc> {
    try {
      return await ExpertKyc.create({
        expertId: expertId,
        address: expertDetails.current_working_address,
        identity_proof_name: expertDetails.identity_proof_type,
        specialisation_name: expertDetails.specialisation,
      });
    } catch (error) {
      throw new Error(`Error creating expert KYC: ${error}`);
    }
  }

  async updateExpertOtp(email: string, otp: string): Promise<IExpert | null> {
    try {
      return await Expert.findOneAndUpdate(
        { email },
        {
          $set: { otp },
          $currentDate: { otp_update_time: true },
        },
        { new: true }
      );
    } catch (error) {
      throw new Error(`Error updating expert OTP: ${error}`);
    }
  }

  async updateExpertVerification(
    email: string,
    isVerified: boolean,
    newEmail?: string
  ): Promise<IExpert | null> {
    try {
      const updateData: Partial<IExpert> = {
        is_verified: isVerified,
      };

      if (newEmail) {
        updateData.email = newEmail;
      }

      return await Expert.findOneAndUpdate(
        { email },
        { $set: updateData },
        { new: true }
      );
    } catch (error) {
      throw new Error(`Error updating expert verification: ${error}`);
    }
  }

  async updateExpertOtpDetails(
    userId: string,
    otp: string
  ): Promise<IExpert | null> {
    try {
      return await Expert.findByIdAndUpdate(
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
      throw new Error(`Error updating expert OTP details: ${error}`);
    }
  }

  async findById(id: string): Promise<IExpert | null> {
    try {
      return await Expert.findById(id);
    } catch (error) {
      console.error("Error in expert repository findById:", error);
      throw new Error("Database operation failed");
    }
  }


  async updateExpertProfile(
    id: string,
    updateData: Partial<IExpert>
  ): Promise<IExpert | null> {
    return this.update(id, updateData); // Using base repository method
  }


  async updateExpertById(
    expertId: string,
    updateData: Partial<IExpert>
  ): Promise<IExpert | null> {
    return this.update(expertId, updateData); // Using base repository method
  }


  async updateProfilePicture(
    expertId: string,
    imageUrl: string
  ): Promise<void> {
    try {
      await this.update(expertId, { profile_picture: imageUrl } as Partial<IExpert>);
    } catch (error) {
      throw new Error(`Error updating profile picture: ${error}`);
    }
  }

  async checkExpertStatus(expertId: string): Promise<{ blocked: boolean }> {
    try {
      
      const expert = await this.findById(expertId);
      if (!expert) {
        throw new Error("Expert not found");
      }
      return { blocked: expert.blocked ?? false };
    } catch (error) {
      console.error("error for expert check status repository", error);
      throw new Error("Data base operation failed");
    }
  }

  async updatePassword(email: string, hashedPassword: string): Promise<IExpert | null> {
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

  async findSlotByExpertIdAndTime(expertId: string, time: Date): Promise<ISlot | null> {
    try {
      return await Slot.findOne({ expertId, time });
    } catch (error) {
      throw new Error(`Error finding slot: ${error}`);
    }
  }

  async createSlot(slotData: Partial<ISlot>): Promise<ISlot> {
    try {
      const slot = await Slot.create(slotData);
      return await slot.save();
    } catch (error) {
      throw new Error(`Error creating slot: ${error}`);
    }
  }

  async findAdminSettings(): Promise<any[]> {
    try {
      return await Admin.find({});
    } catch (error) {
      throw new Error(`Error finding admin settings: ${error}`);
    }
  }
  

}




export default ExpertRepository;
