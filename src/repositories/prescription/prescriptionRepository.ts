import { IPrescriptionInput } from "../../interfaces/commonInterface";
import { BookedSlot, IBookedSlot } from "../../models/bookeSlotModel";
import { IPrescription, Prescription } from "../../models/prescriptionModel";
import BaseRepository from "../base/baseRepository";
import { IPrescriptionRepository } from "./IPrescriptionRepository";

class PrescriptionRepository
  extends BaseRepository<IPrescription>
  implements IPrescriptionRepository
{
  constructor() {
    super(Prescription);
  }

  async findPrescriptionById(
    prescriptionId: string
  ): Promise<IPrescription | null> {
    return await Prescription.findById(prescriptionId).populate({
      path: "bookedSlot",
      populate: {
        path: "expertId",
        select: "firstName lastName specialisation",
      },
    });
  }

  async createPrescription(
    prescriptionData: IPrescriptionInput
  ): Promise<IPrescription> {
    const newPrescription = new Prescription(prescriptionData);
    return await newPrescription.save();
  }

  async updateBookedSlotWithPrescription(
    appointmentId: string,
    prescriptionId: string
  ): Promise<void> {
    await BookedSlot.findByIdAndUpdate(appointmentId, {
      $set: { prescription_id: prescriptionId },
    });
  }

  async findBookedSlotById(appointmentId: string): Promise<IBookedSlot | null> {
    return await BookedSlot.findById(appointmentId);
  }

  async findPrescriptionsById(
    prescriptionId: string
  ): Promise<IPrescription | null> {
    return await Prescription.findById(prescriptionId);
  }

  async getPrescriptionsByExpert(): Promise<IPrescription[]> {
    try {
      const prescriptions = await Prescription.find()
        .populate({
          path: "bookedSlot",
          populate: {
            path: "userId",
            select: "firstName lastName email",
          },
        })
        .populate({
          path: "bookedSlot",
          populate: {
            path: "expertId",
            select: "firstName lastName",
          },
        });

      return prescriptions;
    } catch (error) {
      console.log(error);
      throw new Error("Error fetching prescriptions");
    }
  }
}

export default PrescriptionRepository;
