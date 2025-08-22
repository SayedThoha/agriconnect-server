import { ISlotData, SlotUpdateData } from "../../interfaces/commonInterface";
import { IAdmin } from "../../models/adminModel";
import { IExpert } from "../../models/expertModel";
import { ISlot } from "../../models/slotModel";
import { IBaseRepository } from "../base/IBaseRepository";

export interface ISlotRepository extends IBaseRepository<ISlot> {
  findSlotByExpertIdAndTime(
    expertId: string,
    time: Date
  ): Promise<ISlot | null>;
  createSlot(slotData: Partial<ISlot>): Promise<ISlot>;
  findAdminSettings(): Promise<IAdmin[]>;
  findExpertById(id: string): Promise<IExpert | null>;
  createMultipleSlots(slots: ISlotData[]): Promise<ISlot[]>;
  findSlotsByExpertId(expertId: string, currentTime: Date): Promise<ISlot[]>;
  findSlotById(slotId: string): Promise<ISlot | null>;
  deleteSlotById(slotId: string): Promise<ISlot | null>;
  getSlots(expertId: string): Promise<ISlot[]>;
  updateSlotBooking(data: SlotUpdateData): Promise<ISlot | null>;
  userFindSlotById(slotId: string): Promise<ISlot | null>;
}
