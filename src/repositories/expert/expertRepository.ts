import { IExpertRepository } from "./IExpertRepository";
import { Specialisation } from "../../models/specialisationModel";
import { Expert, IExpert } from "../../models/expertModel";
import { ExpertKyc, IExpertKyc } from "../../models/expertKycModel";

class ExpertRepository implements IExpertRepository {
  constructor() {}

  async getSpecialisations() {
    console.log("get specialisation serverside");
    return await Specialisation.find();
  }

  async findByEmail(email: string): Promise<IExpert | null> {
    return await Expert.findOne({ email });
  }

  async create(expertData: Partial<IExpert>): Promise<IExpert> {
    const expert = await Expert.create(expertData);
    return await expert.save();
  }

  
  async createKyc(expertId: string,expertDetails:IExpert): Promise<IExpertKyc> {
    return await ExpertKyc.create({
      expertId: expertId,
    address: expertDetails.current_working_address,
    identity_proof_name: expertDetails.identity_proof_type,
    specialisation_name: expertDetails.specialisation,
    });
  }

  async updateExpertOtp(email: string, otp: string): Promise<IExpert | null> {
    return await Expert.findOneAndUpdate(
      { email },
      {
        $set: { otp },
        $currentDate: { otp_update_time: true },
      },
      { new: true }
    );
  }

  async updateExpertVerification(
    email: string,
    isVerified: boolean,
    newEmail?: string
  ): Promise<IExpert | null> {
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
  }

  async updateExpertOtpDetails(
    userId: string,
    otp: string
  ): Promise<IExpert | null> {
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
  }

  async findById(id: string): Promise<IExpert | null> {
    try {
      return await Expert.findById(id);
    } catch (error) {
      console.error("Error in expert repository findById:", error);
      throw new Error("Database operation failed");
    }
  }

  async updateExpertProfile(id: string, updateData: Partial<IExpert>): Promise<IExpert | null> {
    try {
      return await Expert.findOneAndUpdate(
        { _id: id },
        {
          $set: updateData,
        },
        { new: true } 
      );
    } catch (error) {
      console.error('Error in expert repository updateExpertProfile:', error);
      throw new Error('Database operation failed');
    }
  }

  async updateExpertById(expertId: string, updateData: Partial<IExpert>): Promise<IExpert | null> {
      try {
        return await Expert.findByIdAndUpdate(expertId, { $set: updateData }, { new: true });
      } catch (error) {
        console.error('Error in updateExpertById:', error);
        throw new Error('Database operation failed');
      }
    }

      async updateProfilePicture(expertId: string, imageUrl: string): Promise<void> {
        try {
          await Expert.findByIdAndUpdate(expertId, {
            $set: { profile_picture: imageUrl },
          });
        } catch (error) {
          console.error("Error in updateProfilePicture repository:", error);
          throw new Error("Database operation failed");
        }
      }
  

}

export default ExpertRepository;
