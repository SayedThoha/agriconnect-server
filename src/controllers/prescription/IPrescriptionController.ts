import { Request, Response } from "express";
export interface IPrescriptionController{
    getPrescriptionDetails(req: Request, res: Response): Promise<void>;
    addPrescription(req: Request, res: Response): Promise<void>;
    getPrescriptionDetailsByExpert(req: Request, res: Response): Promise<void>;
    getAllPrescriptions(req: Request, res: Response): Promise<void>;
}