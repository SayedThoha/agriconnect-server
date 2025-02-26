/* eslint-disable @typescript-eslint/no-explicit-any */
import { ISlotData, SlotUpdateData } from "../../interfaces/commonInterface";
import { Admin } from "../../models/adminModel";
import { Expert, IExpert } from "../../models/expertModel";
import { ISlot, Slot } from "../../models/slotModel";
import BaseRepository from "../base/baseRepository";
import { ISlotRepository } from "./ISlotRepository";

class SlotRepository extends BaseRepository<ISlot> implements ISlotRepository {

  constructor() {
    super(Slot);
  }
// expert
  async findSlotByExpertIdAndTime(
    expertId: string,
    time: Date
  ): Promise<ISlot | null> {
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

  async findAdminSettings(): Promise<any> {
    try {
      return await Admin.find({});
    } catch (error) {
      throw new Error(`Error finding admin settings: ${error}`);
    }
  }

  async findExpertById(id: string): Promise<IExpert | null> {
      try {
        return await Expert.findById(id);
      } catch (error) {
        console.error("Error in expert repository findById:", error);
        throw new Error("Database operation failed");
      }
    }

  async createMultipleSlots(slots: ISlotData[]): Promise<ISlot[]> {
    return await Slot.insertMany(slots);
  }

  async findSlotsByExpertId(
    expertId: string,
    currentTime: Date
  ): Promise<ISlot[]> {
    try {
      return await Slot.find({
        expertId: expertId,
        time: { $gte: currentTime },
      }).sort({ time: 1 });
    } catch (error) {
      throw new Error(`Error fetching slots for expert ${expertId}: ${error}`);
    }
  }


  async findSlotById(slotId: string): Promise<ISlot | null> {
    return await Slot.findById(slotId);
  }

  async deleteSlotById(slotId: string): Promise<ISlot | null> {
    return await Slot.findByIdAndDelete(slotId);
  }

// user
  async getSlots(expertId: string): Promise<ISlot[]> {
    try {
      const now = new Date().toISOString();
      const slots = await Slot.find({
        expertId: expertId,
        booked: false,
        time: { $gte: now }, 
      }).sort({ time: 1 });

      return slots;
    } catch (error) {
      console.error(error);
      throw error;
    }
  }

 async updateSlotBooking(data: SlotUpdateData): Promise<ISlot | null> {
    try {
      const updatedSlot = await Slot.findByIdAndUpdate(
        data._id,
        {
          $set: {
            bookedUserId: data.userId,
            expertId: data.expertId,
            booked: true,
          },
        },
        { new: true }
      );

      return updatedSlot;
    } catch (error) {
      console.error("Error in slot repository updateSlotBooking:", error);
      throw error;
    }
  }

  async userFindSlotById(slotId: string): Promise<ISlot | null> {
    try {
      const slot = await Slot.findById(slotId).populate("expertId").exec();

      return slot;
    } catch (error) {
      console.error("Error in slot repository findSlotById:", error);
      throw error;
    }
  }

  

}

export default SlotRepository;
