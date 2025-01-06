/* eslint-disable  @typescript-eslint/no-explicit-any */

import { Http_Status_Codes } from "../constants/httpStatusCodes";
import { ExpertRegistrationDTO } from "../interfaces/expertInterface";
import { AccessedUser, LoginResponse } from "../interfaces/userInterface";
import { IExpert } from "../models/expertModel";
import { ISpecialisation } from "../models/specialisationModel";
import ExpertRepository from "../repositories/expert/expertRepository";
import { comparePass, hashedPass } from "../utils/hashPassword";
import { generateOtp } from "../utils/otp";
import { sentOtpToEmail } from "../utils/sendOtpToMail";
import jwt from "jsonwebtoken";

export type ExpertResponse = IExpert | null;
export type ExpertResponeType = IExpert | null | { success?: boolean };

interface OtpVerificationResult {
  success: boolean;
  statusCode: number;
  message: string;
}
class ExpertServices {
  private readonly OTP_EXPIRY_MINUTES = 59;
  constructor(
    private expertRepository: ExpertRepository,
    private jwtSecret: string = process.env.JWT_SECRET || "default_secret"
  ) {}

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
    await this.expertRepository.createKyc(expert._id.toString());

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
      // Generate new OTP
      const otp = generateOtp();

      // Update user with new OTP
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

      // Send OTP via email
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
      // Find user
      const expert = await this.expertRepository.findByEmail(email);

      if (!expert) {
        return {
          success: false,
          statusCode: Http_Status_Codes.NOT_FOUND,
          message: "User not found",
        };
      }

      // Verify OTP
      if (expert.otp !== otp) {
        return {
          success: false,
          statusCode: Http_Status_Codes.UNAUTHORIZED,
          message: "Incorrect OTP",
        };
      }

      // Check OTP expiration
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

      // Update user verification status
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
      // Find expert
      const expert = await this.expertRepository.findByEmail(email);

      if (!expert) {
        return {
          success: false,
          statusCode: Http_Status_Codes.UNAUTHORIZED,
          message: "Invalid username",
        };
      }

      // Verify password
      const passwordMatch = await comparePass(password, expert.password);
      if (!passwordMatch) {
        return {
          success: false,
          statusCode: Http_Status_Codes.UNAUTHORIZED,
          message: "Incorrect password",
        };
      }

      // Check if user is blocked
      if (expert.blocked === true) {
        return {
          success: false,
          statusCode: Http_Status_Codes.FORBIDDEN,
          message: "Your account is blocked by Admin",
        };
      }

      // Check if user is verified
      if (expert.is_verified === false) {
        // Generate and save new OTP
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

        // Send OTP
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

      // Generate JWT token
      const accessToken = jwt.sign({ expertId: expert._id }, this.jwtSecret);

      // Create user object for response
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
}

export default ExpertServices;
