import { Http_Status_Codes } from "../../constants/httpStatusCodes";
import { SlotServiceResponse } from "../../interfaces/expertInterface";
import { ISlot } from "../../models/slotModel";
import mongoose from "mongoose";
import { ISlotData, SlotUpdateData } from "../../interfaces/commonInterface";
import { ISlotService } from "./ISlotService";
import { ISlotRepository } from "../../repositories/slot/ISlotRepository";
class SlotService implements ISlotService {
  constructor(private slotRepository: ISlotRepository) {}

  private convertToLocalDate(date: Date): Date {
    const utcDate = new Date(date);
    return new Date(utcDate.getTime() - utcDate.getTimezoneOffset() * 60000);
  }

  async createSlot(slotData: {
    _id: string;
    time: Date;
  }): Promise<SlotServiceResponse<ISlot>> {
    try {
      const slotLocalDate = this.convertToLocalDate(slotData.time);
      const currentLocalDate = this.convertToLocalDate(new Date());
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

      const expertObjectId = new mongoose.Types.ObjectId(slotData._id);
      const newSlotData: Partial<ISlot> = {
        expertId: expertObjectId,
        time: slotData.time,
        booked: false,
        cancelled: false,
        adminPaymentAmount: admin[0].payOut,
        bookingAmount: expert.consultation_fee,
        created_time: new Date(),
      };

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
      const slot = await this.slotRepository.findSlotById(slotId);
      if (!slot) {
        return {
          success: false,
          statusCode: Http_Status_Codes.NOT_FOUND,
          message: "Slot not found",
        };
      }

      if (slot.booked) {
        return {
          success: false,
          statusCode: Http_Status_Codes.BAD_REQUEST,
          message: "Slot is already booked and cannot be removed.",
        };
      }

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
  async getExpertSlots(expertId: string): Promise<ISlot[]> {
    try {
      const slots = await this.slotRepository.getSlots(expertId);
      return slots;
    } catch (error) {
      console.error("Error in getExpertSlots service:", error);
      throw error;
    }
  }
  async bookSlot(slotData: SlotUpdateData): Promise<ISlot | null> {
    try {
      const updatedSlot = await this.slotRepository.updateSlotBooking(slotData);
      if (!updatedSlot) {
        throw new Error("Slot not found or could not be updated");
      }
      return updatedSlot;
    } catch (error) {
      console.error("Error in slot service bookSlot:", error);
      throw error;
    }
  }
  async getSlotDetails(slotId: string): Promise<ISlot | null> {
    try {
      const slot = await this.slotRepository.userFindSlotById(slotId);
      if (!slot) {
        throw new Error("Slot not found");
      }
      return slot;
    } catch (error) {
      console.error("Error in slot service getSlotDetails:", error);
      throw error;
    }
  }
}

export default SlotService;
