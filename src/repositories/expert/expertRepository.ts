/* eslint-disable @typescript-eslint/no-explicit-any */
import { IExpertRepository } from "./IExpertRepository";
import { Specialisation } from "../../models/specialisationModel";
import { Expert, IExpert } from "../../models/expertModel";
import { ExpertKyc, IExpertKyc } from "../../models/expertKycModel";
import BaseRepository from "../base/baseRepository";
import { Slot } from "../../models/slotModel";

import { IPrescriptionInput } from "../../interfaces/commonInterface";
import { BookedSlot, IBookedSlot } from "../../models/bookeSlotModel";
import { IPrescription, Prescription } from "../../models/prescriptionModel";
import { User } from "../../models/userModel";

class ExpertRepository
  extends BaseRepository<IExpert>
  implements IExpertRepository
{
  constructor() {
    super(Expert);
  }

  async getSpecialisations() {
  
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
    return this.update(id, updateData); 
  }

  async updateExpertById(
    expertId: string,
    updateData: Partial<IExpert>
  ): Promise<IExpert | null> {
    return this.update(expertId, updateData); 
  }

  async updateProfilePicture(
    expertId: string,
    imageUrl: string
  ): Promise<void> {
    try {
      await this.update(expertId, {
        profile_picture: imageUrl,
      } as Partial<IExpert>);
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

  async updatePassword(
    email: string,
    hashedPassword: string
  ): Promise<IExpert | null> {
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

  async getBookingDetails(expertId: string): Promise<IBookedSlot[]> {

    return await BookedSlot.find({
      expertId: expertId,
    })
      .populate("slotId")
      .populate("userId")
      .populate("expertId");
  }

  async getExpertDashboardDetails(expertId: string): Promise<IBookedSlot[]> {
    try {
      const bookedSlots = await BookedSlot.find({
        expertId: expertId,
      }).populate("slotId");

      return bookedSlots;
    } catch (error) {
      console.error("Error in findBookedSlotsByUser:", error);
      throw error;
    }
  }



  async findBookedSlotsByExpert(expertId: string): Promise<string[]> {
    const now = new Date().toISOString();

    const slots = await Slot.find({
      expertId: expertId,
      booked: true,
      time: { $gte: now },
    }).sort({ time: 1 });

    return slots.map((slot) => slot._id.toString());
  }

  async findBookedSlotsBySlotIds(
    slotIds: string[],
    expertId: string
  ): Promise<IBookedSlot[]> {
    return await BookedSlot.find({
      slotId: { $in: slotIds },
      expertId: expertId,
      consultation_status: "pending",
    })
      .populate("slotId")
      .populate("userId")
      .populate("expertId");
  }

  async createPrescription(
    prescriptionData: IPrescriptionInput
  ): Promise<IPrescription> {
    const newPrescription = new Prescription(prescriptionData);
    return await newPrescription.save();
  }

  async updateBookedSlotWithPrescription(
    appointmentId: string,
    prescriptionId: string
  ): Promise<void> {
    await BookedSlot.findByIdAndUpdate(appointmentId, {
      $set: { prescription_id: prescriptionId },
    });
  }

  async findBookedSlotById(appointmentId: string): Promise<IBookedSlot | null> {
    return await BookedSlot.findById(appointmentId);
  }

  async updateRoomIdForSlot(
    slotId: string,
    roomId: string
  ): Promise<IBookedSlot | null> {
    return await BookedSlot.findByIdAndUpdate(
      slotId,
      { $set: { roomId } },
      { new: true }
    );
  }

  async getUserEmailFromSlot(slot: any): Promise<string | null> {
    const user = await User.findById(slot?.userId);
    return user ? user.email : null;
  }

  async findPrescriptionById(
    prescriptionId: string
  ): Promise<IPrescription | null> {
    return await Prescription.findById(prescriptionId);
  }
}

export default ExpertRepository;
