/* eslint-disable @typescript-eslint/no-empty-object-type */
import { Request, Response } from "express";
import { SearchUserRequest } from "../../interfaces/commonInterface";
import { KycUpdateData } from "../../models/expertKycModel";
import { DownloadRequest } from "../../interfaces/adminInterface";

export interface IAdminController {
  login(req: Request, res: Response): Promise<void>;
  getAdminDashboardDetails(req: Request, res: Response): Promise<void>;
  getExperts(req: Request, res: Response): Promise<void>;
  getUsers(req: Request, res: Response): Promise<void>;
  getSpecialisations(req: Request, res: Response): Promise<void>;
  addSpecialisation(req: Request, res: Response): Promise<void>;
  editSpecialisation(req: Request, res: Response): Promise<void>;
  deleteSpecialisation(req: Request, res: Response): Promise<void>;
  toggleBlockStatus(req: Request, res: Response): Promise<void>;
  getUserDetails(req: Request, res: Response): Promise<void>;
  searchUsers(
    req: Request<{}, {}, SearchUserRequest>,
    res: Response
  ): Promise<void>;
  searchExperts(
    req: Request<{}, {}, SearchUserRequest>,
    res: Response
  ): Promise<void>;
  toggleExpertStatus(req: Request, res: Response): Promise<void>;
  getKycData(req: Request, res: Response): Promise<void>;
  getExpertKycDetails(
    req: Request<{}, {}, {}, { expertId?: string }>,
    res: Response
  ): Promise<void>;
  submitKycDetails(
    req: Request<{}, {}, KycUpdateData>,
    res: Response
  ): Promise<void>;
  downloadKycDocuments(
    req: Request<{}, {}, {}, DownloadRequest>,
    res: Response
  ): Promise<Response>;
  editPayOut(req: Request, res: Response): Promise<void>;
  getAppointmentDetails(req: Request, res: Response): Promise<void>;
  
}
