import { Date } from "mongoose";
import { IBookedSlot } from "../../models/bookeSlotModel";
import { IBookedSlotService } from "./IBookedSlotService";
import { ISlot } from "../../models/slotModel";
import { IBookedSlotRepository } from "../../repositories/bookedSlot/IBookedSlotRepository";

class BookedSlotService implements IBookedSlotService {
  constructor(private bookedSlotRepository: IBookedSlotRepository) {}
  async getBookingDetails(userId: string): Promise<IBookedSlot[]> {
    try {
      if (!userId) {
        throw new Error("User ID is required");
      }
      const bookings = await this.bookedSlotRepository.findBookedSlotsByUser(
        userId
      );
      return bookings;
    } catch (error) {
      console.error("Error in getBookingDetails service:", error);
      throw error;
    }
  }

  async getUpcomingSlot(appointmentId: string): Promise<IBookedSlot> {
    const data = await this.bookedSlotRepository.findBookedSlotById(
      appointmentId
    );
    if (!data) {
      throw new Error("Appointment not found");
    }
    return data;
  }

  async getUpcomingAppointment(userId: string): Promise<IBookedSlot | null> {
    const now = new Date();
    const margin = 15 * 60 * 1000;

    const bookedSlots =
      await this.bookedSlotRepository.findPendingAppointmentsByUser(userId);

    const upcomingAppointments = bookedSlots.filter((slot: IBookedSlot) => {
      if (
        !slot.slotId ||
        typeof slot.slotId !== "object" ||
        !("time" in slot.slotId) ||
        !(
          typeof slot.slotId.time === "string" ||
          typeof slot.slotId.time === "number" ||
          slot.slotId.time instanceof Date
        )
      ) {
        console.error("Invalid slotId:", slot.slotId);
        return false;
      }

      const slotTime = new Date(slot.slotId.time);
      return slotTime.getTime() > now.getTime() - margin;
    });

    upcomingAppointments.sort(
      (a, b) =>
        new Date((a.slotId as ISlot).time).getTime() -
        new Date((b.slotId as ISlot).time).getTime()
    );

    return upcomingAppointments[0] || {};
  }

  async getUpcomingAppointmentByExpert(
    expertId: string
  ): Promise<IBookedSlot | null> {
    const now = new Date();
    const margin = 15 * 60 * 1000;
    const bookedSlots =
      await this.bookedSlotRepository.findPendingAppointmentsByExpert(expertId);
    const upcomingAppointments = bookedSlots.filter((slot) => {
      if (
        !slot.slotId ||
        typeof slot.slotId !== "object" ||
        !("time" in slot.slotId) ||
        !(
          typeof slot.slotId.time === "string" ||
          typeof slot.slotId.time === "number" ||
          slot.slotId.time instanceof Date
        )
      ) {
        console.error("Invalid slotId:", slot.slotId);
        return false;
      }
      const slotTime = new Date(slot.slotId.time);
      return slotTime.getTime() > now.getTime() - margin;
    });
    upcomingAppointments.sort(
      (a, b) =>
        new Date((a.slotId as ISlot).time).getTime() -
        new Date((b.slotId as ISlot).time).getTime()
    );
    return upcomingAppointments[0] || {};
  }

  async updateUpcomingSlot(
    appointmentId: string,
    roomId: string
  ): Promise<IBookedSlot> {
    const data = await this.bookedSlotRepository.findSlotByIdAndUpdate(
      appointmentId,
      roomId
    );
    if (!data) {
      throw new Error("Appointment not found");
    }
    return data;
  }

  async updateSlotStatus(
    appointmentId: string,
    status: string
  ): Promise<IBookedSlot> {
    const data = await this.bookedSlotRepository.findSlotByIdAndUpdateStatus(
      appointmentId,
      status
    );
    if (!data) {
      throw new Error("Appointment not found");
    }
    return data;
  }
}

export default BookedSlotService;
