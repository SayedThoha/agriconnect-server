/* eslint-disable @typescript-eslint/no-explicit-any */
import { ISlotData, SlotUpdateData } from "../../interfaces/commonInterface";
import { IExpert } from "../../models/expertModel";
import { ISlot } from "../../models/slotModel";

export interface ISlotRepository {
  findSlotByExpertIdAndTime(
    expertId: string,
    time: Date
  ): Promise<ISlot | null>;
  createSlot(slotData: Partial<ISlot>): Promise<ISlot>;
  findAdminSettings(): Promise<any>;
  findExpertById(id: string): Promise<IExpert | null>;
  createMultipleSlots(slots: ISlotData[]): Promise<ISlot[]>;
  findSlotsByExpertId(expertId: string, currentTime: Date): Promise<ISlot[]>;
  findSlotById(slotId: string): Promise<ISlot | null>;
  deleteSlotById(slotId: string): Promise<ISlot | null>;
  getSlots(expertId: string): Promise<ISlot[]>;
  updateSlotBooking(data: SlotUpdateData): Promise<ISlot | null>;
  userFindSlotById(slotId: string): Promise<ISlot | null>;
}
