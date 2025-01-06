import { Http_Status_Codes } from "../constants/httpStatusCodes";
import { IAdminResponse, ILoginResult } from "../interfaces/adminInterface";
import AdminRepository from "../repositories/admin/adminRepository";
import { comparePass } from "../utils/hashPassword";
import jwt from "jsonwebtoken";

class AdminServices {
  constructor(
    private adminRepository: AdminRepository,
    private jwtSecret: string = process.env.JWT_SECRET || "default_secret"
  ) {}
  async validateLogin(email: string, password: string): Promise<ILoginResult> {
    const adminData = await this.adminRepository.findByEmail(email);

    if (!adminData) {
      return {
        success: false,
        status: Http_Status_Codes.NOT_FOUND,
        message: "Invalid username",
      };
    }

    const passwordMatch = await comparePass(password, adminData.password);

    if (!passwordMatch) {
      return {
        success: false,
        status: Http_Status_Codes.NOT_FOUND,
        message: "Incorrect Password",
      };
    }

    const accessToken = jwt.sign({ adminId: adminData._id }, this.jwtSecret);

    const accessedUser: IAdminResponse = {
      email: adminData.email,
      role: adminData.role,
      payOut: adminData.payOut,
    };

    return {
      success: true,
      status: Http_Status_Codes.OK,
      data: {
        accessToken,
        accessedUser,
        message: "Login successfully",
      },
    };
  }

  async getAdminDashboardDetails() {
  
    const userCount = await this.adminRepository.getUserCount();
    const expertCount = await this.adminRepository.getExpertCount();

    return {
      
      userCount,
      expertCount,
    };
  }
}

export default AdminServices;
