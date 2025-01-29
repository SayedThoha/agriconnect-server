// /* eslint-disable  @typescript-eslint/no-explicit-any */
import fs from "fs";
import path from "path";
import { config } from "dotenv";
import { Http_Status_Codes } from "../../constants/httpStatusCodes";
import { IAdminResponse, ILoginResult } from "../../interfaces/adminInterface";
import {
  IExpertKyc,
  KycUpdateData,
  KycVerificationField,
} from "../../models/expertKycModel";
import { IExpert } from "../../models/expertModel";
import { ISpecialisation } from "../../models/specialisationModel";
import { IUser } from "../../models/userModel";
import AdminRepository from "../../repositories/admin/adminRepository";

import { comparePass } from "../../utils/hashPassword";
import jwt from "jsonwebtoken";
import { IAdminService } from "./IAdminService";

config();
class AdminServices implements IAdminService {
  private jwtSecret: string = process.env.JWT_SECRET || "default_secret";

  constructor(
    private adminRepository: AdminRepository,

    private baseDestinationPath = path.join(
      "D:",
      "Project 2 Pics",
      "agriconnect_files"
    )
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
    // Ensure adminData._id is treated as a string (or ObjectId) for simplicity
    if (!adminData._id) {
      return {
        success: false,
        status: Http_Status_Codes.INTERNAL_SERVER_ERROR,
        message: "Invalid user ID",
      };
    }
    if (!this.jwtSecret) {
      throw new Error(
        "JWT_SECRET is not defined. Please set it in your environment."
      );
    }

    const accessToken = jwt.sign({ adminId: adminData._id }, this.jwtSecret);

    console.log("secret in adminlogin", this.jwtSecret);
    console.log("accessToken in login admin", accessToken);
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

  async getAdminDashboardDetails(): Promise<{
    userCount: number;
    expertCount: number;
  }> {
    const userCount = await this.adminRepository.getUserCount();
    const expertCount = await this.adminRepository.getExpertCount();

    return {
      userCount,
      expertCount,
    };
  }

  async getAllExperts(): Promise<IExpert[]> {
    try {
      const experts = await this.adminRepository.findAllExperts();
      return experts;
    } catch (error) {
      console.error("Error in getAllExperts service:", error);
      throw error;
    }
  }

  async getAllUsers(): Promise<IUser[]> {
    try {
      const users = await this.adminRepository.findAllUsers();
      return users;
    } catch (error) {
      console.error("Error in getAllExperts service:", error);
      throw error;
    }
  }

  async toggleUserBlockStatus(_id: string): Promise<void> {
    try {
      if (!_id) {
        throw new Error("User ID is required");
      }

      const user = await this.adminRepository.findUserById(_id);
      if (!user) {
        throw new Error("User not found");
      }

      const newBlockStatus = user.blocked === true ? false : true;
      await this.adminRepository.updateUserBlockStatus(_id, newBlockStatus);
    } catch (error) {
      console.error("Error in toggleUserBlockStatus service:", error);
      throw error;
    }
  }

  async getUserDetails(_id: string): Promise<IUser> {
    try {
      if (!_id) {
        throw new Error("User ID is required");
      }

      const user = await this.adminRepository.findUserById(_id);
      if (!user) {
        throw new Error("User not found");
      }

      return user;
    } catch (error) {
      console.error("Error in getUserDetails service:", error);
      throw error;
    }
  }

  async searchUsers(searchTerm: string): Promise<IUser[]> {
    try {
      if (!searchTerm) {
        throw new Error("Search term is required");
      }
      return await this.adminRepository.searchUsers(searchTerm);
    } catch (error) {
      console.error("Error in searchUsers service:", error);
      throw error;
    }
  }

  async searchExperts(searchTerm: string): Promise<IExpert[]> {
    try {
      if (!searchTerm) {
        throw new Error("Search term is required");
      }
      return await this.adminRepository.searchExperts(searchTerm);
    } catch (error) {
      console.error("Error in searchUsers service:", error);
      throw error;
    }
  }

  async getAllSpecialisations(): Promise<ISpecialisation[]> {
    try {
      const specialisations =
        await this.adminRepository.findAllSpecialisations();
      return specialisations;
    } catch (error) {
      console.error("Error in getAllSpecializations service:", error);
      throw error;
    }
  }

  async addSpecialisation(specialisationData: {
    specialisation: string;
  }): Promise<void> {
    try {
      if (!specialisationData.specialisation) {
        throw new Error("Specialisation is required");
      }
      await this.adminRepository.createSpecialisation(
        specialisationData.specialisation
      );
    } catch (error) {
      console.error("Error in addSpecialisation service:", error);
      throw error;
    }
  }

  async editSpecialisation(data: {
    _id: string;
    specialisation: string;
  }): Promise<void> {
    try {
      if (!data._id || !data.specialisation) {
        throw new Error("Invalid specialization data");
      }

      await this.adminRepository.updateSpecialisation(
        data._id,
        data.specialisation
      );
    } catch (error) {
      console.error("Error in editSpecialisation service:", error);
      throw error;
    }
  }

  async deleteSpecialisation(_id: string): Promise<void> {
    try {
      if (!_id) {
        throw new Error("Specialisation ID is required");
      }

      const isDeleted = await this.adminRepository.deleteSpecialisation(_id);

      if (!isDeleted) {
        throw new Error("Specialisation not found");
      }
    } catch (error) {
      console.error("Error in deleteSpecialisation service:", error);
      throw error;
    }
  }

  async toggleExpertStatus(_id: string): Promise<void> {
    try {
      if (!_id) {
        throw new Error("Expert ID is required");
      }

      const expert = await this.adminRepository.findExpertById(_id);

      if (!expert) {
        throw new Error("Expert not found");
      }

      // Toggle the status
      expert.blocked = expert.blocked === true ? false : true;

      await this.adminRepository.updateExpertStatus(expert);
    } catch (error) {
      console.error("Error in toggleExpertStatus service:", error);
      throw error;
    }
  }

  async getPendingKycData(): Promise<IExpertKyc[]> {
    try {
      const kycData = await this.adminRepository.findPendingKycData();

      // Filter out entries where expertId is null
      const filteredKycData = kycData.filter((item) => item.expertId !== null);

      return filteredKycData;
    } catch (error) {
      console.error("Error in getPendingKycData service:", error);
      throw error;
    }
  }

  async getExpertKycDetails(expertId: string): Promise<IExpertKyc> {
    try {
      if (!expertId) {
        throw new Error("Expert ID is required");
      }

      const kycDetails = await this.adminRepository.findKycByExpertId(expertId);

      if (!kycDetails) {
        throw new Error("KYC details not found");
      }

      return kycDetails;
    } catch (error) {
      console.error("Error in getExpertKycDetails service:", error);
      throw error;
    }
  }

  private verificationOrder: KycVerificationField[] = [
    "id_proof_type",
    "id_proof",
    "expert_licence",
    "qualification_certificate",
    "exp_certificate",
    "specialisation",
    "current_working_address",
  ];

  private getFailedVerification(
    kycDetails: IExpertKyc
  ): { field: KycVerificationField; message: string } | null {
    for (const field of this.verificationOrder) {
      if (!kycDetails[field]) {
        const messages = {
          id_proof_type:
            "Verify ID proof type selected and submitted are the same",
          id_proof: "Verify ID proof",
          expert_licence: "Verify experts's license",
          qualification_certificate: "Verify qualification certificates",
          exp_certificate: "Verify experience certificate",
          specialisation: "Verify specialisation meets qualification",
          current_working_address: "Verify currently working address",
        };
        return { field, message: messages[field] };
      }
    }
    return null;
  }

  async submitKycDetails(data: KycUpdateData): Promise<{ message: string }> {
    try {
      if (!data._id) {
        throw new Error("KYC ID is required");
      }

      const kycDetails = await this.adminRepository.updateKycDetails(
        data._id,
        data
      );

      if (!kycDetails) {
        throw new Error("KYC details not found");
      }

      const failedVerification = this.getFailedVerification(kycDetails);

      if (failedVerification) {
        return { message: failedVerification.message };
      }

      // All verifications passed, update expert status
      await this.adminRepository.updateExpertKycStatus(data.expert_id, true);
      return { message: "KYC verification done" };
    } catch (error) {
      console.error("Error in submitKycDetails service:", error);
      throw error;
    }
  }

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  private getFilePath(expert: IExpert, name: any, index: number) {
    switch (name) {
      case "identity_proof":
        return expert.identity_proof;
      case "expert_licence":
        return expert.expert_licence;
      case "qualification_certificate":
        return index != -1 ? expert.qualification_certificate[index] : null;
      case "experience_certificate":
        return index != -1 ? expert.experience_certificate[index] : null;
      default:
        return null;
    }
  }

  /**
   * Copy file to destination folder.
   */
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  private copyFile(sourcePath: string, name: any) {
    const fullPath = path.resolve(sourcePath);
    const destinationPath = path.join(
      this.baseDestinationPath,
      `${name}_${Date.now()}${path.basename(fullPath)}`
    );

    return new Promise((resolve, reject) => {
      fs.copyFile(fullPath, destinationPath, (err) => {
        if (err) {
          console.error("Error copying file:", err);
          reject(new Error("File copy failed"));
        } else {
          resolve(destinationPath);
        }
      });
    });
  }

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  async downloadDocument(data: { expertId: any; name: any; index: any }) {
    const { expertId, name, index } = data;
    const expert = await this.adminRepository.findExpertById(expertId);

    if (!expert) {
      throw new Error("Expert not found");
    }

    const filePath = this.getFilePath(expert, name, index);

    if (!filePath) {
      throw new Error("File not found");
    }

    return this.copyFile(filePath, name);
  }
}

export default AdminServices;
