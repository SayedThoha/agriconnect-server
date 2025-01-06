import { Request, Response } from "express";
import { Http_Status_Codes } from "../constants/httpStatusCodes";
import AdminService from "../services/adminService";

class AdminController {
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

  async getAdminDashboardDetails(req: Request, res: Response) {
    try {
      console.log("getAdminDashboardDetails server-side");
      const { userCount, expertCount } =
        await this.adminService.getAdminDashboardDetails();

      res
        .status(Http_Status_Codes.OK)
        .json({ user_count: userCount, expert_count: expertCount });
    } catch (error) {
      console.error("Error in getAdminDashboardDetails:", error);
      res
        .status(Http_Status_Codes.INTERNAL_SERVER_ERROR)
        .json({ message: "Internal Server Error" });
    }
  }
}

export default AdminController;
