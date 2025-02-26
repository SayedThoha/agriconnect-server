import { IBookedSlot } from "../../models/bookeSlotModel";

export interface IBookedSlotRepository {
  findBookedSlotsByUser(userId: string): Promise<IBookedSlot[]>;
  findBookedSlotById(appointmentId: string): Promise<IBookedSlot | null>;
  findPendingAppointmentsByUser(userId: string): Promise<IBookedSlot[]>;
  findPendingAppointmentsByExpert(expertId: string): Promise<IBookedSlot[]>;
  findSlotByIdAndUpdate(
    slotId: string,
    roomId: string
  ): Promise<IBookedSlot | null>;
  findSlotByIdAndUpdateStatus(
    slotId: string,
    status: string
  ): Promise<IBookedSlot | null>;
}
