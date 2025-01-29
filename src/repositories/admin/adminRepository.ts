import { IExpertDocuments } from "../../interfaces/adminInterface";
import { Admin, IAdmin } from "../../models/adminModel";
import { IExpertKyc, ExpertKyc } from "../../models/expertKycModel";
import { Expert, IExpert } from "../../models/expertModel";
import {
  ISpecialisation,
  Specialisation,
} from "../../models/specialisationModel";
import { IUser, User } from "../../models/userModel";
import BaseRepository from "../base/baseRepository";
import { IAdminRepository } from "./IAdminRepository";

class AdminRepository extends BaseRepository<IAdmin>  implements IAdminRepository {
  constructor() {
    super(Admin)
  }

  // async findByEmail(email: string): Promise<IAdmin | null> {
  //   return await Admin.findOne({ email });
  // }

  
  async findByEmail(email: string): Promise<IAdmin | null> {
    try {
      return await this.model.findOne({ email });
    } catch (error) {
      throw new Error(`Error finding admin by email: ${error}`);
    }
  }

  async getUserCount(): Promise<number> {
    try{
    return await User.countDocuments({});
    }catch(error){
      throw new Error(`Error getting user count: ${error}`);
    }
  }

  async getExpertCount(): Promise<number> {
    try{
    return await Expert.countDocuments({});
    }catch(error){
      throw new Error(`Error getting expert count: ${error}`);
    }
  }


  async findAllExperts(): Promise<IExpert[]> {
    try {
      const experts = await Expert.find();
      return experts;
    } catch (error) {
      console.error("Error in findAllExperts repository:", error);
      throw error;
    }
  }

  async findAllUsers(): Promise<IUser[]> {
    try {
      const users = await User.find();
      return users;
    } catch (error) {
      console.error("Error in findAllExperts repository:", error);
      throw error;
    }
  }

  async findAllSpecialisations(): Promise<ISpecialisation[]> {
    try {
      const specialisations = await Specialisation.find();
      return specialisations;
    } catch (error) {
      console.error("Error in findAllSpecializations repository:", error);
      throw error;
    }
  }

  async createSpecialisation(specialisation: string): Promise<ISpecialisation> {
    try {
      const newSpecialisation = await Specialisation.create({
        specialisation: specialisation,
      });
      await newSpecialisation.save();
      return newSpecialisation;
    } catch (error) {
      console.error("Error in createSpecialization repository:", error);
      throw error;
    }
  }

  async updateSpecialisation(
    _id: string,
    specialisation: string
  ): Promise<void> {
    try {
      const result = await Specialisation.updateOne(
        { _id },
        { specialisation }
      );

      if (!result.matchedCount) {
        throw new Error("Specialisation not found");
      }
    } catch (error) {
      console.error("Error in updateSpecialisation repository:", error);
      throw error;
    }
  }

  async deleteSpecialisation(_id: string): Promise<boolean> {
    try {
      const result = await Specialisation.deleteOne({ _id });
      return result.deletedCount > 0;
    } catch (error) {
      console.error("Error in deleteSpecialisation repository:", error);
      throw error;
    }
  }

  async findUserById(_id: string): Promise<IUser | null> {
    try {
      return await User.findOne({ _id });
    } catch (error) {
      console.error("Error in findUserById repository:", error);
      throw error;
    }
  }

  async updateUserBlockStatus(_id: string, blocked: boolean): Promise<void> {
    try {
      const user = await User.findOne({ _id });
      if (!user) {
        throw new Error("User not found");
      }
      user.blocked = blocked;
      await user.save();
    } catch (error) {
      console.error("Error in updateUserBlockStatus repository:", error);
      throw error;
    }
  }

  async searchUsers(searchTerm: string): Promise<IUser[]> {
    try {
      const regex = new RegExp("^" + searchTerm.toLowerCase(), "i");
      const users = await User.find();

      return users.filter(
        (user: IUser) =>
          regex.test(user.firstName) ||
          regex.test(user.lastName) ||
          regex.test(user.email)
      );
    } catch (error) {
      console.error("Error in searchUsers repository:", error);
      throw error;
    }
  }

  async searchExperts(searchTerm: string): Promise<IExpert[]> {
    try {
      const regex = new RegExp("^" + searchTerm.toLowerCase(), "i");
      const experts = await Expert.find();

      return experts.filter(
        (expert: IExpert) =>
          regex.test(expert.firstName) ||
          regex.test(expert.lastName) ||
          regex.test(expert.email)
      );
    } catch (error) {
      console.error("Error in searchExperts repository:", error);
      throw error;
    }
  }

  async findExpertById(_id: string): Promise<IExpert | null> {
    try {
      return await Expert.findById(_id);
    } catch (error) {
      console.error("Error in findById repository:", error);
      throw error;
    }
  }

  async updateExpertStatus(expert: IExpert): Promise<void> {
    try {
      await expert.save();
    } catch (error) {
      console.error("Error in updateExpertStatus repository:", error);
      throw error;
    }
  }

  async findPendingKycData(): Promise<IExpertKyc[]> {
    try {
      const data = await ExpertKyc.find()
        .populate({
          path: "expertId",
          match: { kyc_verification: "false" },
          select: "-password -created_time -otp -otp_update_time -__v",
        })
        .exec();

      return data;
    } catch (error) {
      console.error("Error in findPendingKycData repository:", error);
      throw error;
    }
  }

  async findKycByExpertId(expertId: string): Promise<IExpertKyc | null> {
    try {
      return await ExpertKyc.findOne({ expertId }).populate("expertId").exec();
    } catch (error) {
      console.error("Error in findKycByExpertId repository:", error);
      throw error;
    }
  }

  async updateKycDetails(
    kycId: string,
    updateData: Partial<IExpertKyc>
  ): Promise<IExpertKyc | null> {
    try {
      return await ExpertKyc.findByIdAndUpdate(
        kycId,
        {
          $set: {
            exp_certificate: updateData.exp_certificate,
            qualification_certificate: updateData.qualification_certificate,
            expert_licence: updateData.expert_licence,
            id_proof_type: updateData.id_proof_type,
            id_proof: updateData.id_proof,
            specialisation: updateData.specialisation,
            current_working_address: updateData.current_working_address,
          },
        },
        { new: true }
      );
    } catch (error) {
      console.error("Error in updateKycDetails repository:", error);
      throw error;
    }
  }

  async updateExpertKycStatus(expertId: string, verified: boolean): Promise<void> {
    try {
      await Expert.findByIdAndUpdate(
        expertId,
        {
          $set: { kyc_verification: verified },
        }
      );
    } catch (error) {
      console.error('Error in updateExpertKycStatus repository:', error);
      throw error;
    }
  }

  async findByIdForDownload(expertId: string): Promise<IExpertDocuments | null> {
    try {
      return await Expert.findById(expertId);
    } catch (error) {
      console.error('Error in findById repository:', error);
      throw error;
    }
  }
}

export default AdminRepository;
