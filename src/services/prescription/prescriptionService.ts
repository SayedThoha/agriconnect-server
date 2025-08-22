import { IPrescription } from "../../models/prescriptionModel";
import { IPrescriptionRepository } from "../../repositories/prescription/IPrescriptionRepository";
import { IPrescriptionService } from "./IPrescriptionService";

class PrescriptionService implements IPrescriptionService {
  constructor(private prescriptionRepository: IPrescriptionRepository) {}

  async getPrescriptionDetails(prescriptionId: string): Promise<IPrescription> {
    const data = await this.prescriptionRepository.findPrescriptionById(
      prescriptionId
    );
    if (!data) {
      throw new Error("Prescription not found");
    }
    return data;
  }

  async addPrescription(
    appointmentId: string,
    issue: string,
    prescription: string
  ): Promise<IPrescription> {
    if (!appointmentId || !issue || !prescription) {
      throw new Error("Missing required fields");
    }
    try {
      const bookedSlot = await this.prescriptionRepository.findBookedSlotById(
        appointmentId
      );
      if (!bookedSlot) {
        throw new Error("Appointment not found");
      }
      const newPrescription =
        await this.prescriptionRepository.createPrescription({
          bookedSlot: appointmentId,
          issue,
          prescription,
        });
      await this.prescriptionRepository.updateBookedSlotWithPrescription(
        appointmentId,
        newPrescription._id as string
      );
      return newPrescription;
    } catch (error) {
      console.error("Error adding prescription:", error);
      throw new Error("Failed to add prescription");
    }
  }

  async getPrescriptionDetailsByExpert(
    prescriptionId: string
  ): Promise<IPrescription> {
    const data = await this.prescriptionRepository.findPrescriptionsById(
      prescriptionId
    );
    if (!data) {
      throw new Error("Prescription not found");
    }
    return data;
  }

  async getAllPrescriptions(): Promise<IPrescription[]> {
    try {
      return await this.prescriptionRepository.getPrescriptionsByExpert();
    } catch (error) {
      console.log(error);
      throw new Error("Prescriptions not found");
    }
  }
}

export default PrescriptionService;
