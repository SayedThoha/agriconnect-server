import { Request, Response } from "express";
import { Http_Status_Codes } from "../../constants/httpStatusCodes";
import { IPrescriptionController } from "./IPrescriptionController";
import { IPrescriptionService } from "../../services/prescription/IPrescriptionService";

class PrescriptionController implements IPrescriptionController {
  constructor(private prescriptionService: IPrescriptionService) {}
  async getPrescriptionDetails(req: Request, res: Response): Promise<void> {
    try {
      const { _id } = req.query;

      if (!_id) {
        res
          .status(Http_Status_Codes.BAD_REQUEST)
          .json({ message: "Missing required data" });
        return;
      }

      const data = await this.prescriptionService.getPrescriptionDetails(
        _id as string
      );

      res.status(Http_Status_Codes.OK).json(data);
    } catch (error) {
      console.error(error);
      res
        .status(Http_Status_Codes.INTERNAL_SERVER_ERROR)
        .json({ message: "Internal Server Error" });
    }
  }
  async addPrescription(req: Request, res: Response): Promise<void> {
    try {
      const { appointmentId, issue, prescription } = req.query;

      if (!appointmentId || !issue || !prescription) {
        res.status(Http_Status_Codes.BAD_REQUEST).json({
          message: "Missing required fields",
        });
        return;
      }

      const newPrescription = await this.prescriptionService.addPrescription(
        appointmentId.toString(),
        issue.toString(),
        prescription.toString()
      );

      res.status(Http_Status_Codes.CREATED).json({
        message: "Prescription added",
        prescription: newPrescription,
      });
    } catch (error) {
      console.error("Error in addPrescription:", error);
      res.status(Http_Status_Codes.INTERNAL_SERVER_ERROR).json({
        message:
          error instanceof Error ? error.message : "Internal Server Error",
      });
    }
  }
  async getPrescriptionDetailsByExpert(
    req: Request,
    res: Response
  ): Promise<void> {
    try {
      const { _id } = req.query;

      if (!_id) {
        res
          .status(Http_Status_Codes.BAD_REQUEST)
          .json({ message: "Missing required data" });
        return;
      }

      const data =
        await this.prescriptionService.getPrescriptionDetailsByExpert(
          _id as string
        );

      res.status(Http_Status_Codes.OK).json(data);
    } catch (error) {
      console.error(error);
      res
        .status(Http_Status_Codes.INTERNAL_SERVER_ERROR)
        .json({ message: "Internal Server Error" });
    }
  }

  async getAllPrescriptions(req: Request, res: Response): Promise<void> {
    try {
      const prescriptions =
        await this.prescriptionService.getAllPrescriptions();
      res.status(Http_Status_Codes.OK).json(prescriptions);
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: "internal server Error" });
    }
  }
}

export default PrescriptionController;
