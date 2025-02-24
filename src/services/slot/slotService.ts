import { Http_Status_Codes } from "../../constants/httpStatusCodes";
import { SlotServiceResponse } from "../../interfaces/expertInterface";
import { ISlot } from "../../models/slotModel";
import SlotRepository from "../../repositories/slot/slotRepository";
import mongoose from "mongoose";

import { ISlotData } from "../../interfaces/commonInterface";
import { ISlotService } from "./ISlotService";
class SlotService implements ISlotService {
  constructor(
    private slotRepository: SlotRepository
  ) {}

  private convertToLocalDate(date: Date): Date {
    const utcDate = new Date(date);
    return new Date(utcDate.getTime() - utcDate.getTimezoneOffset() * 60000);
  }

  async createSlot(slotData: {
    _id: string;
    time: Date;
  }): Promise<SlotServiceResponse<ISlot>> {
    try {
      // Convert dates
      const slotLocalDate = this.convertToLocalDate(slotData.time);
      const currentLocalDate = this.convertToLocalDate(new Date());

      // Check if slot exists
      const existingSlot = await this.slotRepository.findSlotByExpertIdAndTime(
        slotData._id,
        slotData.time
      );

      if (existingSlot) {
        return {
          success: false,
          statusCode: Http_Status_Codes.CONFLICT,
          message: "Slot already exists",
        };
      }

      if (slotLocalDate <= currentLocalDate) {
        return {
          success: false,
          statusCode: Http_Status_Codes.CONFLICT,
          message: "The selected slot is no longer available",
        };
      }

      // Get required data
      const [admin, expert] = await Promise.all([
        this.slotRepository.findAdminSettings(),
        this.slotRepository.findExpertById(slotData._id),
      ]);

      if (!expert) {
        return {
          success: false,
          statusCode: Http_Status_Codes.NOT_FOUND,
          message: "Expert not found",
        };
      }
      // Convert string ID to ObjectId
      const expertObjectId = new mongoose.Types.ObjectId(slotData._id);
      // Create slot data
      const newSlotData: Partial<ISlot> = {
        expertId: expertObjectId,
        time: slotData.time,
        booked: false,
        cancelled: false,
        adminPaymentAmount: admin[0].payOut,
        bookingAmount: expert.consultation_fee,
        created_time: new Date(),
      };

      // Create slot
      const slot = await this.slotRepository.createSlot(newSlotData);

      return {
        success: true,
        statusCode: Http_Status_Codes.CREATED,
        message: "Slot created successfully",
        data: slot,
      };
    } catch (error) {
      console.error("Error in createSlot:", error);
      return {
        success: false,
        statusCode: Http_Status_Codes.INTERNAL_SERVER_ERROR,
        message: error instanceof Error ? error.message : "Error creating slot",
      };
    }
  }

  async addAllSlots(expertId: string, slots: Date[]): Promise<ISlot[]> {
    if (!expertId || !slots.length) {
      throw new Error("Expert ID and slots are required");
    }

    const [admin, expert] = await Promise.all([
      this.slotRepository.findAdminSettings(),
      this.slotRepository.findExpertById(expertId),
    ]);

    // console.log(admin);

    if (!admin || !expert) {
      throw new Error("Admin or expert not found");
    }
    const slotData: ISlotData[] = slots.map((time) => ({
      expertId: new mongoose.Types.ObjectId(expertId),
      time,
      adminPaymentAmount: admin[0].payOut,
      bookingAmount: expert.consultation_fee,
      booked: false,
      cancelled: false,
      created_time: new Date(),
    }));

    return this.slotRepository.createMultipleSlots(slotData);
  }

  async getExpertSlotDetails(expertId: string): Promise<ISlot[]> {
    const currentTime = new Date();
    // console.log(expertId);
    try {
      return await this.slotRepository.findSlotsByExpertId(
        expertId,
        currentTime
      );
    } catch (error) {
      throw new Error(`Error fetching expert slot details: ${error}`);
    }
  }

  async removeSlot(slotId: string): Promise<SlotServiceResponse<null>> {
    try {
      // console.log("Removing slot with ID:", slotId);

      // Find slot
      const slot = await this.slotRepository.findSlotById(slotId);
      if (!slot) {
        return {
          success: false,
          statusCode: Http_Status_Codes.NOT_FOUND,
          message: "Slot not found",
        };
      }

      // Check if slot is booked
      if (slot.booked) {
        return {
          success: false,
          statusCode: Http_Status_Codes.BAD_REQUEST,
          message: "Slot is already booked and cannot be removed.",
        };
      }

      // Delete slot
      await this.slotRepository.deleteSlotById(slotId);
      return {
        success: true,
        statusCode: Http_Status_Codes.OK,
        message: "Slot successfully deleted",
      };
    } catch (error) {
      console.error("Error in removeSlot:", error);
      return {
        success: false,
        statusCode: Http_Status_Codes.INTERNAL_SERVER_ERROR,
        message: error instanceof Error ? error.message : "Error deleting slot",
      };
    }
  }

}

export default SlotService;
