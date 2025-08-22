import { SlotUpdateData } from "../../interfaces/commonInterface";
import { SlotServiceResponse } from "../../interfaces/expertInterface";
import { ISlot } from "../../models/slotModel";

export interface ISlotService {
  createSlot(slotData: {
    _id: string;
    time: Date;
  }): Promise<SlotServiceResponse<ISlot>>;
  addAllSlots(expertId: string, slots: Date[]): Promise<ISlot[]>;
  getExpertSlotDetails(expertId: string): Promise<ISlot[]>;
  removeSlot(slotId: string): Promise<SlotServiceResponse<null>>;
  getExpertSlots(expertId: string): Promise<ISlot[]>;
  bookSlot(slotData: SlotUpdateData): Promise<ISlot | null>;
  getSlotDetails(slotId: string): Promise<ISlot | null>;
}
