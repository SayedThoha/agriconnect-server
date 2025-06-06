/* eslint-disable @typescript-eslint/no-empty-object-type */
/* eslint-disable  @typescript-eslint/no-explicit-any */

import { Request, Response } from "express";
import { Http_Status_Codes } from "../../constants/httpStatusCodes";
import AdminService from "../../services/admin/adminService";
import { KycUpdateData } from "../../models/expertKycModel";
import { DownloadRequest } from "../../interfaces/adminInterface";
import { IAdminController } from "./IAdminController";
import { SearchUserRequest } from "../../interfaces/commonInterface";

class AdminController implements IAdminController {
  constructor(private adminService: AdminService) {}

  async login(req: Request, res: Response): Promise<void> {
    try {
      const requiredFields = ["email", "password"];
      const missingFields = requiredFields.filter((field) => !req.body[field]);
      if (missingFields.length > 0) {
        res.status(Http_Status_Codes.BAD_REQUEST).json({
          success: false,
          error: `Missing required fields: ${missingFields.join(", ")}`,
        });
        return;
      }
      const { email, password } = req.body;
      const result = await this.adminService.validateLogin(email, password);
      res
        .status(result.status)
        .json(result.success ? result.data : { message: result.message });
    } catch (error) {
      console.error("Admin login error:", error);
      res.status(Http_Status_Codes.INTERNAL_SERVER_ERROR).json({
        message: "Internal Server Error",
      });
    }
  }

  async getAdminDashboardDetails(req: Request, res: Response): Promise<void> {
    try {
      const { userCount, expertCount, slotDetails } =
        await this.adminService.getAdminDashboardDetails();

      res.status(Http_Status_Codes.OK).json({
        user_count: userCount,
        expert_count: expertCount,
        slotDetails: slotDetails,
      });
    } catch (error) {
      console.error("Error in getAdminDashboardDetails:", error);
      res
        .status(Http_Status_Codes.INTERNAL_SERVER_ERROR)
        .json({ message: "Internal Server Error" });
    }
  }

  async getExperts(req: Request, res: Response): Promise<void> {
    try {
      const { expert } = req.query;

      if (expert === "all") {
        const expertData = await this.adminService.getAllExperts();
        res.status(Http_Status_Codes.OK).json(expertData);
        return;
      }
      res.status(Http_Status_Codes.BAD_REQUEST).json({
        message: "Invalid expert type specified",
      });
    } catch (error) {
      console.error("Error in getExperts controller:", error);
      res.status(Http_Status_Codes.INTERNAL_SERVER_ERROR).json({
        message: "Internal Server Error",
      });
    }
  }

  async getUsers(req: Request, res: Response): Promise<void> {
    try {
      const userData = await this.adminService.getAllUsers();
      res.status(Http_Status_Codes.OK).json(userData);
    } catch (error) {
      console.error("Error in getUsers controller:", error);
      res.status(Http_Status_Codes.INTERNAL_SERVER_ERROR).json({
        message: "Internal Server Error",
      });
    }
  }

  async getSpecialisations(req: Request, res: Response): Promise<void> {
    try {
      const specialisationData =
        await this.adminService.getAllSpecialisations();
      res.status(Http_Status_Codes.OK).json(specialisationData);
    } catch (error) {
      console.error("Error in getSpecializations controller:", error);
      res.status(Http_Status_Codes.INTERNAL_SERVER_ERROR).json({
        message: "Internal Server Error",
      });
    }
  }

  async addSpecialisation(req: Request, res: Response): Promise<void> {
    try {
      const data = req.body;
      if (!data) {
        res.status(Http_Status_Codes.BAD_REQUEST).json({
          message: "Submission Failed",
        });
        return;
      }
      await this.adminService.addSpecialisation(data);

      res.status(Http_Status_Codes.CREATED).json({
        message: "Specialisation added Successfully",
      });
    } catch (error) {
      console.error("Error in addSpecialisation controller:", error);
      res.status(Http_Status_Codes.INTERNAL_SERVER_ERROR).json({
        message: "Internal Server Error",
      });
    }
  }

  async editSpecialisation(req: Request, res: Response): Promise<void> {
    try {
      const data = req.body;

      if (!data) {
        res.status(Http_Status_Codes.BAD_REQUEST).json({
          message: "Edit Failed",
        });
        return;
      }
      await this.adminService.editSpecialisation(data);

      res.status(Http_Status_Codes.OK).json({
        message: "Edit Successfully",
      });
    } catch (error: any) {
      console.error("Error in editSpecialization controller:", error);
      if (error.message === "Specialization not found") {
        res.status(Http_Status_Codes.NOT_FOUND).json({
          message: "Specialization not found",
        });
        return;
      }
      if (error.message === "Invalid specialization data") {
        res.status(Http_Status_Codes.BAD_REQUEST).json({
          message: "Invalid data provided",
        });
        return;
      }
      res.status(Http_Status_Codes.INTERNAL_SERVER_ERROR).json({
        message: "Internal Server Error",
      });
    }
  }

  async deleteSpecialisation(req: Request, res: Response): Promise<void> {
    try {
      const data = req.query;
      if (!data || !data._id) {
        res.status(Http_Status_Codes.BAD_REQUEST).json({
          message: "Delete Failed - ID is required",
        });
        return;
      }
      await this.adminService.deleteSpecialisation(data._id as string);
      res.status(Http_Status_Codes.OK).json({
        message: "Delete Successfully",
      });
    } catch (error: any) {
      console.error("Error in deleteSpecialization controller:", error);
      if (error.message === "Specialization not found") {
        res.status(Http_Status_Codes.NOT_FOUND).json({
          message: "Specialization not found",
        });
        return;
      }
      if (error.message === "Specialization ID is required") {
        res.status(Http_Status_Codes.BAD_REQUEST).json({
          message: "Invalid specialization ID",
        });
        return;
      }
      res.status(Http_Status_Codes.INTERNAL_SERVER_ERROR).json({
        message: "Internal Server Error",
      });
    }
  }

  async toggleBlockStatus(req: Request, res: Response): Promise<void> {
    try {
      const data = req.body;
      if (!data._id) {
        res.status(Http_Status_Codes.BAD_REQUEST).json({
          message: "Missing required data",
        });
        return;
      }
      await this.adminService.toggleUserBlockStatus(data._id);
      res.status(Http_Status_Codes.OK).json({
        message: "Status changed successfully",
      });
    } catch (error: any) {
      console.error("Error in toggleBlockStatus controller:", error);
      if (error.message === "User not found") {
        res.status(Http_Status_Codes.NOT_FOUND).json({
          message: "User not found",
        });
        return;
      }
      if (error.message === "User ID is required") {
        res.status(Http_Status_Codes.BAD_REQUEST).json({
          message: "User ID is required",
        });
        return;
      }
      res.status(Http_Status_Codes.INTERNAL_SERVER_ERROR).json({
        message: "Internal Server Error",
      });
    }
  }

  async getUserDetails(req: Request, res: Response): Promise<void> {
    try {
      const data = req.body;

      if (!data._id) {
        res.status(Http_Status_Codes.BAD_REQUEST).json({
          message: "Missing required data",
        });
        return;
      }
      const user = await this.adminService.getUserDetails(data._id);
      res.status(Http_Status_Codes.OK).json(user);
    } catch (error: any) {
      console.error("Error in getUserDetails controller:", error);
      if (error.message === "User not found") {
        res.status(Http_Status_Codes.NOT_FOUND).json({
          message: "User not found",
        });
        return;
      }
      if (error.message === "User ID is required") {
        res.status(Http_Status_Codes.BAD_REQUEST).json({
          message: "User ID is required",
        });
        return;
      }
      res.status(Http_Status_Codes.INTERNAL_SERVER_ERROR).json({
        message: "Internal Server Error",
      });
    }
  }

  async searchUsers(
    req: Request<{}, {}, SearchUserRequest>,
    res: Response
  ): Promise<void> {
    try {
      const { data } = req.body;

      if (!data) {
        res.status(Http_Status_Codes.BAD_REQUEST).json({
          message: "No data to search",
        });
        return;
      }
      const results = await this.adminService.searchUsers(data);
      res.status(Http_Status_Codes.OK).json(results);
    } catch (error: any) {
      console.error("Error in searchUsers controller:", error);
      if (error.message === "Search term is required") {
        res.status(Http_Status_Codes.BAD_REQUEST).json({
          message: "Search term is required",
        });
        return;
      }
      res.status(Http_Status_Codes.INTERNAL_SERVER_ERROR).json({
        message: "Internal Server Error",
      });
    }
  }

  async searchExperts(
    req: Request<{}, {}, SearchUserRequest>,
    res: Response
  ): Promise<void> {
    try {
      const { data } = req.body;

      if (!data) {
        res.status(Http_Status_Codes.BAD_REQUEST).json({
          message: "No data to search",
        });
        return;
      }
      const results = await this.adminService.searchExperts(data);
      res.status(Http_Status_Codes.OK).json(results);
    } catch (error: any) {
      console.error("Error in searchUsers controller:", error);
      if (error.message === "Search term is required") {
        res.status(Http_Status_Codes.BAD_REQUEST).json({
          message: "Search term is required",
        });
        return;
      }
      res.status(Http_Status_Codes.INTERNAL_SERVER_ERROR).json({
        message: "Internal Server Error",
      });
    }
  }

  async toggleExpertStatus(req: Request, res: Response): Promise<void> {
    try {
      const requiredFields = ["_id"];
      const missingFields = requiredFields.filter((field) => !req.body[field]);

      if (missingFields.length > 0) {
        res.status(Http_Status_Codes.BAD_REQUEST).json({
          error: `Missing required fields: ${missingFields.join(", ")}`,
        });
        return;
      }
      const { _id } = req.body;
      await this.adminService.toggleExpertStatus(_id);

      res.status(Http_Status_Codes.OK).json({
        message: "Expert status of block changed",
      });
    } catch (error: any) {
      console.error("Error in toggleExpertStatus controller:", error);
      if (error.message === "Expert not found") {
        res.status(Http_Status_Codes.NOT_FOUND).json({
          message: "Expert not found",
        });
        return;
      }
      if (error.message === "Expert ID is required") {
        res.status(Http_Status_Codes.BAD_REQUEST).json({
          message: "Expert ID is required",
        });
        return;
      }
      res.status(Http_Status_Codes.INTERNAL_SERVER_ERROR).json({
        message: "Internal Server Error",
      });
    }
  }

  async getKycData(req: Request, res: Response): Promise<void> {
    try {
      const kycData = await this.adminService.getPendingKycData();
      res.status(Http_Status_Codes.OK).json(kycData);
    } catch (error) {
      console.error("Error in getKycData controller:", error);
      res.status(Http_Status_Codes.INTERNAL_SERVER_ERROR).json({
        message: "Internal Server Error",
      });
    }
  }

  async getExpertKycDetails(
    req: Request<{}, {}, {}, { expertId?: string }>,
    res: Response
  ): Promise<void> {
    try {
      const { expertId } = req.query;

      if (!expertId) {
        res.status(Http_Status_Codes.BAD_REQUEST).json({
          message: "Fetching doctor ID Failed",
        });
        return;
      }
      const kycDetails = await this.adminService.getExpertKycDetails(expertId);
      res.status(Http_Status_Codes.OK).json(kycDetails);
    } catch (error: any) {
      console.error("Error in getExpertKycDetails controller:", error);

      if (error.message === "Expert ID is required") {
        res.status(Http_Status_Codes.BAD_REQUEST).json({
          message: "Expert ID is required",
        });
        return;
      }
      if (error.message === "KYC details not found") {
        res.status(Http_Status_Codes.NOT_FOUND).json({
          message: "KYC details not found",
        });
        return;
      }
      res.status(Http_Status_Codes.INTERNAL_SERVER_ERROR).json({
        message: "Internal Server Error",
      });
    }
  }

  async submitKycDetails(
    req: Request<{}, {}, KycUpdateData>,
    res: Response
  ): Promise<void> {
    try {
      const data = req.body;
      if (!data) {
        res.status(Http_Status_Codes.BAD_REQUEST).json({
          message: "Fetching expert ID Failed",
        });
        return;
      }
      const result = await this.adminService.submitKycDetails(data);
      res.status(Http_Status_Codes.OK).json(result);
    } catch (error: any) {
      console.error("Error in submitKycDetails controller:", error);

      if (error.message === "KYC ID is required") {
        res.status(Http_Status_Codes.BAD_REQUEST).json({
          message: "KYC ID is required",
        });
        return;
      }

      if (error.message === "KYC details not found") {
        res.status(Http_Status_Codes.NOT_FOUND).json({
          message: "KYC details not found",
        });
        return;
      }
      res.status(Http_Status_Codes.INTERNAL_SERVER_ERROR).json({
        message: "Internal Server Error",
      });
    }
  }

  async downloadKycDocuments(
    req: Request<{}, {}, {}, DownloadRequest>,
    res: Response
  ): Promise<Response> {
    try {
      const { expertId, name, index } = req.query;
      if (!expertId || !name) {
        return res
          .status(Http_Status_Codes.BAD_REQUEST)
          .json({ message: "Fetching data to download failed" });
      }

      const destinationPath = await this.adminService.downloadDocument({
        expertId,
        name,
        index: typeof index === "string" ? parseInt(index, 10) : undefined,
      });

      return res
        .status(Http_Status_Codes.OK)
        .json({ message: "Downloaded Successfully", path: destinationPath });
    } catch (error: unknown) {
      console.error("Error in downloadKycDocuments:", error);

      if (error instanceof Error) {
        switch (error.message) {
          case "Expert not found":
            return res
              .status(Http_Status_Codes.NOT_FOUND)
              .json({ message: "Expert not found" });

          case "File not found":
            return res
              .status(Http_Status_Codes.NOT_FOUND)
              .json({ message: "File not found" });

          case "File copy failed":
            return res
              .status(Http_Status_Codes.INTERNAL_SERVER_ERROR)
              .json({ message: "Error copying file" });
        }
      }
      return res
        .status(Http_Status_Codes.INTERNAL_SERVER_ERROR)
        .json({ message: "Internal Server Error" });
    }
  }

  async editPayOut(req: Request, res: Response): Promise<void> {
    try {
      const data = req.body;
      if (!data || !data.payOut) {
        res
          .status(Http_Status_Codes.BAD_REQUEST)
          .json({ message: "Edit payout failed. Invalid data." });
        return;
      }
      const message = await this.adminService.editPayOut(data.payOut);
      res.status(Http_Status_Codes.OK).json({ message });
    } catch (error) {
      console.error("Error during editPayOut:", error);
      res
        .status(Http_Status_Codes.INTERNAL_SERVER_ERROR)
        .json({ message: "Internal Server Error ." });
    }
  }

  async getAppointmentDetails(req: Request, res: Response): Promise<void> {
    try {
      const appointments = await this.adminService.getAppointmentDetails();
      res.status(Http_Status_Codes.OK).json(appointments);
    } catch (error) {
      console.error("Error fetching appointment details:", error);
      res
        .status(Http_Status_Codes.INTERNAL_SERVER_ERROR)
        .json({ message: "Internal Server Error" });
    }
  }
}

export default AdminController;
