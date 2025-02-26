import { IPrescriptionInput } from "../../interfaces/commonInterface";
import { IBookedSlot } from "../../models/bookeSlotModel";
import { IPrescription } from "../../models/prescriptionModel";

export interface IPrescriptionRepository {
  findPrescriptionById(prescriptionId: string): Promise<IPrescription | null>;
  createPrescription(
    prescriptionData: IPrescriptionInput
  ): Promise<IPrescription>;
  updateBookedSlotWithPrescription(
    appointmentId: string,
    prescriptionId: string
  ): Promise<void>;
  findBookedSlotById(appointmentId: string): Promise<IBookedSlot | null>;
  findPrescriptionsById(prescriptionId: string): Promise<IPrescription | null>;
  getPrescriptionsByExpert(): Promise<IPrescription[]>;
}
