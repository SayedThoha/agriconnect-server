import { BookedSlot, IBookedSlot } from "../../models/bookeSlotModel";
import BaseRepository from "../base/baseRepository";
import { IBookedSlotRepository } from "./IBookedSlotRepository";

class BookedSlotRepository
  extends BaseRepository<IBookedSlot>
  implements IBookedSlotRepository
{
  constructor() {
    super(BookedSlot);
  }

  
  async findBookedSlotsByUser(userId: string): Promise<IBookedSlot[]> {
    try {
      const bookedSlots = await BookedSlot.find({ userId })
        .populate({
          path: "slotId",
          populate: {
            path: "expertId",
          },
        })
        .populate("userId")
        .exec();

      return bookedSlots;
    } catch (error) {
      console.error("Error in findBookedSlotsByUser:", error);
      throw error;
    }
  }


  async findPendingAppointmentsByUser(userId: string): Promise<IBookedSlot[]> {
    return await BookedSlot.find({ userId, consultation_status: "pending" })
      .populate({
        path: "slotId",
        model: "Slot",
      })
      .populate("userId")
      .populate("expertId");
  }


  async findBookedSlotById(appointmentId: string): Promise<IBookedSlot | null> {
    return await BookedSlot.findById(appointmentId);
  }



  async findPendingAppointmentsByExpert(
    expertId: string
  ): Promise<IBookedSlot[]> {
    return await BookedSlot.find({ expertId, consultation_status: "pending" })
      .populate({
        path: "slotId",
        model: "Slot",
      })
      .populate("userId")
      .populate("expertId");
  }


  async findSlotByIdAndUpdate(
    slotId: string,
    roomId: string
  ): Promise<IBookedSlot | null> {
    return await BookedSlot.findByIdAndUpdate(
      { _id: slotId },
      { $set: { roomId: roomId } }
    );
  }

  async findSlotByIdAndUpdateStatus(
    slotId: string,
    status: string
  ): Promise<IBookedSlot | null> {
    return await BookedSlot.findByIdAndUpdate(
      { _id: slotId },
      {
        $set: { consultation_status: status },
      }
    );
  }
  

}

export default BookedSlotRepository;
