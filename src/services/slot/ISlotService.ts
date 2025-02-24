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
}
