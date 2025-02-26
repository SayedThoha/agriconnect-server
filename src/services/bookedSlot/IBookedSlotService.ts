/* eslint-disable @typescript-eslint/no-empty-object-type */
import { IBookedSlot } from "../../models/bookeSlotModel";

export interface IBookedSlotService {
  getBookingDetails(userId: string): Promise<IBookedSlot[]>;
  getUpcomingSlot(appointmentId: string): Promise<IBookedSlot>;
  getUpcomingAppointment(userId: string): Promise<IBookedSlot | {}>;
  getUpcomingAppointmentByExpert(expertId: string): Promise<IBookedSlot | {}>;
  updateUpcomingSlot(
    appointmentId: string,
    roomId: string
  ): Promise<IBookedSlot>;
  updateSlotStatus(appointmentId: string, status: string): Promise<IBookedSlot>;
}
