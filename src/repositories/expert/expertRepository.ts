

import { IExpertRepository } from "./IExpertRepository";
import { specialisation } from "../../models/specialisationModel";
import { Expert, IExpert } from "../../models/expertModel";
import { ExpertKyc, IExpertKyc } from "../../models/expertKycModel";

class ExpertRepository implements IExpertRepository {
  constructor() {}

  async getSpecialisations() {
    console.log("get specialisation serverside");
    return await specialisation.find();
  }

  async findByEmail(email: string): Promise<IExpert | null> {
    return await Expert.findOne({ email });
  }

  async create(expertData: Partial<IExpert>): Promise<IExpert> {
    const expert = await Expert.create(expertData);
    return await expert.save();
  }

  async createKyc(expertId: string): Promise<IExpertKyc> {
    return await ExpertKyc.create({
      expertId: expertId,
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
          is_verified: isVerified
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

  async updateExpertOtpDetails(userId: string, otp: string): Promise<IExpert | null> {
      return await Expert.findByIdAndUpdate(
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

export default ExpertRepository;
