import { IPrescription } from "../../models/prescriptionModel";
export interface IPrescriptionService {
  getPrescriptionDetails(prescriptionId: string): Promise<IPrescription>;
  addPrescription(
    appointmentId: string,
    issue: string,
    prescription: string
  ): Promise<IPrescription>;
  getPrescriptionDetailsByExpert(
    prescriptionId: string
  ): Promise<IPrescription>;
  getAllPrescriptions(): Promise<IPrescription[]>;
}
