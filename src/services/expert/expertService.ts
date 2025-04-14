/* eslint-disable  @typescript-eslint/no-explicit-any */
import { Http_Status_Codes } from "../../constants/httpStatusCodes";
import {
  ExpertRegistrationDTO,
  OtpVerificationResult,
} from "../../interfaces/expertInterface";
import { AccessedUser, LoginResponse } from "../../interfaces/userInterface";
import { IExpert } from "../../models/expertModel";
import { ISpecialisation } from "../../models/specialisationModel";
import ExpertRepository from "../../repositories/expert/expertRepository";
import { comparePass, hashedPass } from "../../utils/hashPassword";
import { generateOtp } from "../../utils/otp";
import { sentOtpToEmail } from "../../utils/sendOtpToMail";
import { IExpertService } from "./IExpertService";
import {
  generateAccessToken,
  generateRefreshToken,
  verifyRefreshToken,
} from "../../utils/token";
import { IBookedSlot } from "../../models/bookeSlotModel";
import { generateMailForRoomId } from "../../utils/sendRoomId";
export type ExpertResponse = IExpert | null;
export type ExpertResponeType = IExpert | null | { success?: boolean };

class ExpertService implements IExpertService {
  private readonly OTP_EXPIRY_MINUTES = 59;
  constructor(private expertRepository: ExpertRepository) {}

  async registerExpert(
    expertData: ExpertRegistrationDTO
  ): Promise<{ status: boolean; message: string }> {
    const existingExpert = await this.expertRepository.findByEmail(
      expertData.email
    );
    if (existingExpert) {
      return { status: false, message: "Email already exists" };
    }
    const hashedPassword = await hashedPass(expertData.password);
    const otp = generateOtp();
    const expert = await this.expertRepository.create({
      ...expertData,
      password: hashedPassword,
      otp,
      otp_update_time: new Date(),
    });
    if (!expert) {
      return { status: false, message: "Failed to register user" };
    }
    const isOtpSent = await sentOtpToEmail(expertData.email, otp);
    if (!isOtpSent) {
      return { status: false, message: "Failed to send OTP" };
    }
    await this.expertRepository.createKyc(expert._id.toString(), expert);
    return { status: true, message: "Expert Registration successful" };
  }
  validateRegistrationData(data: Partial<ExpertRegistrationDTO>): string[] {
    const requiredFields = [
      "firstName",
      "lastName",
      "email",
      "contactno",
      "profile_picture",
      "specialisation",
      "current_working_address",
      "experience",
      "consultation_fee",
      "identity_proof_type",
      "identity_proof",
      "expert_licence",
      "qualification_certificate",
      "experience_certificate",
      "password",
    ];
    return requiredFields.filter(
      (field) => !data[field as keyof ExpertRegistrationDTO]
    );
  }

  async getSpecialisations(): Promise<ISpecialisation[]> {
    return await this.expertRepository.getSpecialisations();
  }
  async resendOtp(email: string): Promise<Record<string, any>> {
    try {
      const otp = generateOtp();
      const updatedExpert = await this.expertRepository.updateExpertOtp(
        email,
        otp
      );

      if (!updatedExpert) {
        return {
          success: false,
          statusCode: Http_Status_Codes.NOT_FOUND,
          message: "User not found",
        };
      }

      const isOtpSent = await sentOtpToEmail(email, otp);
      if (!isOtpSent) {
        return {
          success: false,
          statusCode: Http_Status_Codes.INTERNAL_SERVER_ERROR,
          message: "Failed to send OTP",
        };
      }
      return {
        success: true,
        statusCode: Http_Status_Codes.OK,
        message: "Successfully sent a new OTP",
      };
    } catch (error) {
      console.log(error);

      return {
        success: false,
        statusCode: Http_Status_Codes.INTERNAL_SERVER_ERROR,
        message: "Internal server error",
      };
    }
  }

  async verifyOtp(
    email: string,
    otp: string,
    role?: string,
    newEmail?: string
  ): Promise<OtpVerificationResult> {
    try {
      const expert = await this.expertRepository.findByEmail(email);

      if (!expert) {
        return {
          success: false,
          statusCode: Http_Status_Codes.NOT_FOUND,
          message: "User not found",
        };
      }
      if (expert.otp !== otp) {
        return {
          success: false,
          statusCode: Http_Status_Codes.UNAUTHORIZED,
          message: "Incorrect OTP",
        };
      }
      const otpExpirySeconds = this.OTP_EXPIRY_MINUTES * 60;
      const timeDifference = Math.floor(
        (new Date().getTime() - expert.otp_update_time!.getTime()) / 1000
      );

      if (timeDifference > otpExpirySeconds) {
        return {
          success: false,
          statusCode: Http_Status_Codes.BAD_REQUEST,
          message: "OTP Expired",
        };
      }
      const updatedExpert =
        await this.expertRepository.updateExpertVerification(
          email,
          true,
          role ? newEmail : undefined
        );

      if (!updatedExpert) {
        return {
          success: false,
          statusCode: Http_Status_Codes.INTERNAL_SERVER_ERROR,
          message: "Failed to update user verification status",
        };
      }
      return {
        success: true,
        statusCode: Http_Status_Codes.OK,
        message: "Account verified successfully",
      };
    } catch (error) {
      console.log(error);
      return {
        success: false,
        statusCode: Http_Status_Codes.INTERNAL_SERVER_ERROR,
        message: "Internal server error",
      };
    }
  }
  async loginExpert(email: string, password: string): Promise<LoginResponse> {
    try {
      const expert = await this.expertRepository.findByEmail(email);
      if (!expert) {
        return {
          success: false,
          statusCode: Http_Status_Codes.UNAUTHORIZED,
          message: "Invalid username",
        };
      }
      const passwordMatch = await comparePass(password, expert.password);
      if (!passwordMatch) {
        return {
          success: false,
          statusCode: Http_Status_Codes.UNAUTHORIZED,
          message: "Incorrect password",
        };
      }
      if (expert.blocked === true) {
        return {
          success: false,
          statusCode: Http_Status_Codes.FORBIDDEN,
          message: "Your account is blocked by Admin",
        };
      }
      if (expert.is_verified === false) {
        const otp = generateOtp();
        const updatedExpert =
          await this.expertRepository.updateExpertOtpDetails(
            expert._id.toString(),
            otp
          );

        if (!updatedExpert) {
          return {
            success: false,
            statusCode: Http_Status_Codes.INTERNAL_SERVER_ERROR,
            message: "Failed to update OTP",
          };
        }
        const isOtpSent = await sentOtpToEmail(email, otp);
        if (!isOtpSent) {
          return {
            success: false,
            statusCode: Http_Status_Codes.INTERNAL_SERVER_ERROR,
            message: "Failed to send OTP",
          };
        }
        return {
          success: true,
          statusCode: Http_Status_Codes.OK,
          message: "Complete OTP verification for Login",
          email: email,
        };
      }
      const accessToken = generateAccessToken(expert._id);
      const refreshToken = generateRefreshToken(expert._id);
      const accessedUser: AccessedUser = {
        _id: expert._id,
        firstName: expert.firstName,
        lastName: expert.lastName,
        email: expert.email,
        role: expert.role,
      };
      return {
        success: true,
        statusCode: Http_Status_Codes.OK,
        message: "Login successful",
        accessToken,
        refreshToken,
        accessedUser,
      };
    } catch (error) {
      console.log(error);
      return {
        success: false,
        statusCode: Http_Status_Codes.INTERNAL_SERVER_ERROR,
        message: "Internal server error",
      };
    }
  }

  async getExpertDetails(id: string): Promise<IExpert | null> {
    const expert = await this.expertRepository.findById(id);
    if (!expert) {
      throw new Error("Expert not found");
    }
    return expert;
  }

  async editExpertProfile(
    id: string,
    updateData: Partial<IExpert>
  ): Promise<IExpert | null> {
    if (!id || !updateData) {
      throw new Error("Expert ID and update data are required");
    }
    return this.expertRepository.updateExpertProfile(id, updateData);
  }

  async optForNewEmail(expertId: string, email: string): Promise<any> {
    if (!expertId || !email) {
      throw new Error("Expert ID and email are required");
    }
    const expert = await this.expertRepository.findById(expertId);
    if (!expert) {
      throw new Error("expert not found");
    }
    if (expert.email === email) {
      throw new Error("Existing email. Try another");
    }
    const otp = generateOtp();
    const isOtpSent = await sentOtpToEmail(email, otp);
    if (!isOtpSent) {
      return {
        success: false,
        statusCode: Http_Status_Codes.INTERNAL_SERVER_ERROR,
        message: "Failed to send OTP",
      };
    }
    await this.expertRepository.updateExpertById(expertId, {
      otp: otp,
      otp_update_time: new Date(),
    });
    return "otp sent to mail";
  }

  async editExpertProfilePicture(
    expertId: string,
    imageUrl: string
  ): Promise<string> {
    if (!expertId || !imageUrl) {
      throw new Error("Missing required fields");
    }
    await this.expertRepository.updateProfilePicture(expertId, imageUrl);
    return "Profile picture updated successfully";
  }

  async checkExpertStatus(expertId: string): Promise<{ blocked: boolean }> {
    try {
      const status = await this.expertRepository.checkExpertStatus(expertId);
      return status;
    } catch (error) {
      console.error(error);
      throw new Error("Error checking user status");
    }
  }

  async verifyEmailForPasswordReset(email: string): Promise<void> {
    try {
      const expert = await this.expertRepository.findByEmail(email);
      if (!expert) {
        throw new Error("Invalid Email");
      }
      const otp = generateOtp();
      await sentOtpToEmail(email, otp);
      await this.expertRepository.updateExpertOtp(email, otp);
    } catch (error) {
      console.log(error);
      throw new Error(`Email verification failed`);
    }
  }
  async updatePassword(
    email: string,
    password: string
  ): Promise<{ status: boolean; message: string }> {
    try {
      const hashedPassword = await hashedPass(password);
      const user = await this.expertRepository.updatePassword(
        email,
        hashedPassword
      );

      if (!user) {
        return { status: false, message: "User not found" };
      }

      return { status: true, message: "Password Updated" };
    } catch (error) {
      throw new Error(`Failed to update password: ${error}`);
    }
  }
  async refreshToken(refreshToken: string): Promise<LoginResponse> {
    try {
      const decodedRefreshToken = verifyRefreshToken(refreshToken);
      if (!decodedRefreshToken) {
        return {
          success: false,
          statusCode: Http_Status_Codes.UNAUTHORIZED,
          message: "Invalid refresh token",
        };
      }
      const expert = await this.expertRepository.findById(
        decodedRefreshToken.data
      );
      if (!expert) {
        return {
          success: false,
          statusCode: Http_Status_Codes.NOT_FOUND,
          message: "User not found",
        };
      }
      const newAccessToken = generateAccessToken(expert._id);
      const newRefreshToken = generateRefreshToken(expert._id);
      return {
        success: true,
        statusCode: Http_Status_Codes.OK,
        message: "Token refreshed successfully",
        accessToken: newAccessToken,
        refreshToken: newRefreshToken,
      };
    } catch (error) {
      console.log(error);
      return {
        success: false,
        statusCode: Http_Status_Codes.INTERNAL_SERVER_ERROR,
        message: "Internal server error",
      };
    }
  }
  private convertToLocalDate(date: Date): Date {
    const utcDate = new Date(date);
    return new Date(utcDate.getTime() - utcDate.getTimezoneOffset() * 60000);
  }
  async getBookingDetails(expertId: string): Promise<IBookedSlot[]> {
    try {
      const bookings = await this.expertRepository.getBookingDetails(expertId);

      return bookings;
    } catch (error) {
      console.error(error);
      throw new Error("Failed to fetch booking details");
    }
  }
  async getExpertDashboardDetails(expertId: string): Promise<IBookedSlot[]> {
    try {
      if (!expertId) {
        throw new Error("User ID is required");
      }
      const bookings = await this.expertRepository.getExpertDashboardDetails(
        expertId
      );
      return bookings;
    } catch (error) {
      console.error("Error in getBookingDetails service:", error);
      throw error;
    }
  }

  async getExpertBookings(expertId: string): Promise<IBookedSlot[]> {
    if (!expertId) {
      throw new Error("Expert ID is required");
    }
    try {
      const slotIds = await this.expertRepository.findBookedSlotsByExpert(
        expertId
      );
      if (slotIds.length === 0) {
        return [];
      }
      const bookedSlots = await this.expertRepository.findBookedSlotsBySlotIds(
        slotIds,
        expertId
      );
      return bookedSlots;
    } catch (error) {
      console.error("Error in getExpertBookings:", error);
      throw new Error("Failed to retrieve expertbookings");
    }
  }

  async shareRoomIdService(
    slotId: string,
    roomId: string
  ): Promise<{ message: string }> {
    const slot = await this.expertRepository.updateRoomIdForSlot(
      slotId,
      roomId
    );
    if (!slot) {
      throw new Error("Slot not found");
    }
    const userEmail = await this.expertRepository.getUserEmailFromSlot(slot);
    if (!userEmail) {
      throw new Error("User email not found");
    }
    await generateMailForRoomId(userEmail, roomId);
    return { message: `Room ID sent to user's email.` };
  }
}

export default ExpertService;
