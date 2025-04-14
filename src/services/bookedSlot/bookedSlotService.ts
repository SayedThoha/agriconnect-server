/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @typescript-eslint/no-empty-object-type */
import { IBookedSlot } from "../../models/bookeSlotModel";
import BookedSlotRepository from "../../repositories/bookedSlot/bookedSlotRepository";
import { IBookedSlotService } from "./IBookedSlotService";

class BookedSlotService implements IBookedSlotService {
  constructor(private bookedSlotRepository: BookedSlotRepository) {}

  
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

  async getUpcomingAppointment(userId: string): Promise<IBookedSlot | {}> {
    const now = new Date();
    const margin = 15 * 60 * 1000; 

    const bookedSlots =
      await this.bookedSlotRepository.findPendingAppointmentsByUser(userId);

  
    const upcomingAppointments = bookedSlots.filter((slot) => {
      if (
        !slot.slotId ||
        typeof slot.slotId !== "object" ||
        !("time" in slot.slotId)
      ) {
        console.error("Invalid slotId:", slot.slotId);
        return false;
      }

      const slotTime = new Date((slot.slotId as any).time);
      return slotTime.getTime() > now.getTime() - margin;
    });

    upcomingAppointments.sort(
      (a, b) =>
        new Date((a.slotId as any).time).getTime() -
        new Date((b.slotId as any).time).getTime()
    );

    return upcomingAppointments[0] || {};
  }


  async getUpcomingAppointmentByExpert(
    expertId: string
  ): Promise<IBookedSlot | {}> {
    const now = new Date();
    const margin = 15 * 60 * 1000;
    const bookedSlots =
      await this.bookedSlotRepository.findPendingAppointmentsByExpert(expertId);
    const upcomingAppointments = bookedSlots.filter((slot) => {
      if (
        !slot.slotId ||
        typeof slot.slotId !== "object" ||
        !("time" in slot.slotId)
      ) {
        console.error("Invalid slotId:", slot.slotId);
        return false;
      }
      const slotTime = new Date((slot.slotId as any).time);
      return slotTime.getTime() > now.getTime() - margin;
    });
    upcomingAppointments.sort(
      (a, b) =>
        new Date((a.slotId as any).time).getTime() -
        new Date((b.slotId as any).time).getTime()
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
