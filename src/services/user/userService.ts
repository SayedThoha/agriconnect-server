/* eslint-disable  @typescript-eslint/no-explicit-any */

import { IUserService } from "./IUserService";
import UserRepository from "../../repositories/user/userRepository";
import { IUser } from "../../models/userModel";
import { comparePass, hashedPass } from "../../utils/hashPassword";
import { generateOtp } from "../../utils/otp";
import { sentOtpToEmail } from "../../utils/sendOtpToMail";
import { Http_Status_Codes } from "../../constants/httpStatusCodes";
import {
  AccessedUser,
  LoginResponse,
  OtpVerificationResult,
} from "../../interfaces/userInterface";
import {
  generateAccessToken,
  generateRefreshToken,
  verifyRefreshToken,
} from "../../utils/token";
import { ISpecialisation } from "../../models/specialisationModel";
import { IExpert } from "../../models/expertModel";

import {
  FarmerBookingDetails,
  PaymentOrder,
} from "../../interfaces/commonInterface";
import Razorpay from "razorpay";
import { NotificationService } from "../../utils/notificationService";

export type UserResponse = IUser | null;
export type UserResponeType = IUser | null | { success?: boolean };

class UserService implements IUserService {
  private readonly OTP_EXPIRY_MINUTES = 59;
  private razorpayInstance!: Razorpay;
  constructor(private userRepository: UserRepository) {
    this.initializeRazorpay();
  }

  async registerUser(userData: {
    firstName: string;
    lastName: string;
    email: string;
    password: string;
  }): Promise<any> {
    try {
      const existingUser = await this.userRepository.emailExist(userData.email);

      if (existingUser) {
        return { success: false, message: "Email already exists" };
      }
      const hashedPassword = await hashedPass(userData.password);
      const otp = generateOtp();

      const user = await this.userRepository.saveUser({
        firstName: userData.firstName,
        lastName: userData.lastName,
        email: userData.email,
        password: hashedPassword,
        otp,
        otp_update_time: new Date(),
      });

      if (!user) {
        return { success: false, message: "Failed to register user" };
      }

      const isOtpSent = await sentOtpToEmail(userData.email, otp);
      if (!isOtpSent) {
        return { success: false, message: "Failed to send OTP" };
      }
      return { success: true, message: "Verify OTP to complete registration" };
    } catch (error) {
      console.log(error);
    }
  }

  async resendOtp(email: string): Promise<Record<string, any>> {
    try {
      const otp = generateOtp();

      const updatedUser = await this.userRepository.updateUserOtp(email, otp);

      if (!updatedUser) {
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
      const user = await this.userRepository.findUserByEmail(email);

      if (!user) {
        return {
          success: false,
          statusCode: Http_Status_Codes.NOT_FOUND,
          message: "User not found",
        };
      }

      if (user.otp !== otp) {
        return {
          success: false,
          statusCode: Http_Status_Codes.UNAUTHORIZED,
          message: "Incorrect OTP",
        };
      }

      const otpExpirySeconds = this.OTP_EXPIRY_MINUTES * 60;
      const timeDifference = Math.floor(
        (new Date().getTime() - user.otp_update_time!.getTime()) / 1000
      );

      if (timeDifference > otpExpirySeconds) {
        return {
          success: false,
          statusCode: Http_Status_Codes.BAD_REQUEST,
          message: "OTP Expired",
        };
      }

      const updatedUser = await this.userRepository.updateUserVerification(
        email,
        true,
        role ? newEmail : undefined
      );
      if (!updatedUser) {
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
  async login(email: string, password: string): Promise<LoginResponse> {
    try {
      const user = await this.userRepository.findUserByEmail(email);

      if (!user) {
        return {
          success: false,
          statusCode: Http_Status_Codes.UNAUTHORIZED,
          message: "Invalid username",
        };
      }
      const passwordMatch = await comparePass(password, user.password);
      if (!passwordMatch) {
        return {
          success: false,
          statusCode: Http_Status_Codes.UNAUTHORIZED,
          message: "Incorrect password",
        };
      }
      if (user.blocked === true) {
        return {
          success: false,
          statusCode: Http_Status_Codes.FORBIDDEN,
          message: "Your account is blocked by Admin",
        };
      }
      if (user.is_verified === false) {
        const otp = generateOtp();
        const updatedUser = await this.userRepository.updateUserOtpDetails(
          user._id.toString(),
          otp
        );
        if (!updatedUser) {
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
      const accessToken = generateAccessToken(user._id);
      const refreshToken = generateRefreshToken(user._id);
      const accessedUser: AccessedUser = {
        _id: user._id,
        firstName: user.firstName,
        lastName: user.lastName,
        email: user.email,
        role: user.role,
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

  async getUserDetails(id: string): Promise<IUser | null> {
    const user = await this.userRepository.findUserById(id);
    if (!user) {
      throw new Error("user not found");
    }
    return user;
  }

  async editUserProfile(
    id: string,
    updateData: Partial<IUser>
  ): Promise<IUser | null> {
    if (!id || !updateData) {
      throw new Error("User ID and update data are required");
    }
    return this.userRepository.updateUserProfile(id, updateData);
  }

  async optForNewEmail(userId: string, email: string): Promise<any> {
    if (!userId || !email) {
      throw new Error("User ID and email are required");
    }
    const user = await this.userRepository.findUserById(userId);
    if (!user) {
      throw new Error("User not found");
    }
    if (user.email === email) {
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
    await this.userRepository.updateUserById(userId, {
      otp: otp,
      otp_update_time: new Date(),
    });
    return "otp sent to mail";
  }

  async editUserProfilePicture(
    userId: string,
    imageUrl: string
  ): Promise<string> {
    if (!userId || !imageUrl) {
      throw new Error("Missing required fields");
    }
    await this.userRepository.updateProfilePicture(userId, imageUrl);

    return "Profile picture updated successfully";
  }

  async checkUserStatus(userId: string): Promise<{ blocked: boolean }> {
    try {
      const status = await this.userRepository.checkUserStatus(userId);
      return status;
    } catch (error) {
      console.error(error);
      throw new Error("Error checking user status");
    }
  }

  async verifyEmailForPasswordReset(email: string): Promise<void> {
    try {
      const user = await this.userRepository.findUserByEmail(email);
      if (!user) {
        throw new Error("Invalid Email");
      }
      const otp = generateOtp();
      await sentOtpToEmail(email, otp);
      await this.userRepository.updateUserOtp(email, otp);
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
      const user = await this.userRepository.updatePassword(
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
      const user = await this.userRepository.findUserById(
        decodedRefreshToken.data
      );
      if (!user) {
        return {
          success: false,
          statusCode: Http_Status_Codes.NOT_FOUND,
          message: "User not found",
        };
      }
      const newAccessToken = generateAccessToken(user._id);
      const newRefreshToken = generateRefreshToken(user._id);
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
  async getSpecialisations(): Promise<ISpecialisation[]> {
    return await this.userRepository.getSpecialisations();
  }

  async getExperts(): Promise<IExpert[]> {
    try {
      const experts = await this.userRepository.getExperts();
      return experts;
    } catch (error) {
      console.error("Error in getAllExperts service:", error);
      throw error;
    }
  }

  async getExpertDetails(_id: string): Promise<IExpert> {
    try {
      if (!_id) {
        throw new Error("Expert ID is required");
      }
      const expert = await this.userRepository.getExpertDetailsById(_id);
      if (!expert) {
        throw new Error("User not found");
      }

      return expert;
    } catch (error) {
      console.error("Error in getExpertDetails service:", error);
      throw error;
    }
  }

  async checkSlotAvailability(slotId: string): Promise<{
    isAvailable: boolean;
    message: string;
  }> {
    try {
      const bookedSlot = await this.userRepository.findBookedSlot(slotId);

      if (bookedSlot && bookedSlot.consultation_status === "pending") {
        return {
          isAvailable: false,
          message: "Slot already booked! Try another slot",
        };
      }
      return {
        isAvailable: true,
        message: "Select payment method",
      };
    } catch (error) {
      console.error("Error in slot service checkSlotAvailability:", error);
      throw error;
    }
  }

  private initializeRazorpay(): void {
    try {
      const keyId = process.env.razorpay_key_id;
      const keySecret = process.env.razorpay_secret_id;
      if (!keyId || !keySecret) {
        throw new Error(
          "Razorpay key_id or key_secret is missing in environment variables."
        );
      }
      this.razorpayInstance = new Razorpay({
        key_id: keyId,
        key_secret: keySecret,
      });
    } catch (error) {
      console.error("Failed to initialize Razorpay:", error);
    }
  }

  async createPaymentOrder(fee: number): Promise<PaymentOrder> {
    if (!this.razorpayInstance) {
      throw new Error("Razorpay is not properly initialized");
    }
    return new Promise((resolve, reject) => {
      const options = {
        amount: fee * 100,
        currency: "INR",
        receipt: "razorUser@gmail.com",
      };
      this.razorpayInstance.orders.create(options, (err, order) => {
        if (!err) {
          resolve({
            success: true,
            fee: order.amount,
            key_id: process.env.razorpay_key_id,
            order_id: order.id,
          });
        } else {
          console.log("Razorpay failure case:", err);
          reject({
            success: false,
            message: err || "Payment order creation failed",
          });
        }
      });
    });
  }

  async bookAppointment(farmerDetails: FarmerBookingDetails): Promise<void> {
    try {
      const slot = await this.userRepository.findSlotById(farmerDetails.slotId);
      if (!slot) {
        throw new Error("Slot not found");
      }
      if (slot.booked) {
        throw new Error("Slot already booked");
      }
      const user = await this.userRepository.findUserById(farmerDetails.userId);
      if (!user) {
        throw new Error("User not found");
      }
      const userWallet = user.wallet ?? 0;

      if (farmerDetails.payment_method === "wallet_payment") {
        if (userWallet < slot.bookingAmount) {
          throw new Error("Insufficient balance in wallet");
        }
        await this.userRepository.updateUserWallet(
          user._id.toString(),
          -slot.bookingAmount
        );
      }
      await this.userRepository.updateSlotBookingStatus(
        farmerDetails.slotId,
        true
      );

      await this.userRepository.createBookedSlot(farmerDetails);

      const expertId = slot.expertId._id;
      await NotificationService.sendNotification(
        user._id.toString(),
        expertId.toString(),
        `Your slot booking for ${slot.time} is confirmed!`,
        "booking_success"
      );
    } catch (error) {
      console.log(error);
    }
  }

  async cancelSlot(slotId: string): Promise<{ message: string }> {
    const slot = await this.userRepository.findSlotByIdAndUpdate(slotId, {
      cancelled: true,
    });
    if (!slot) {
      throw new Error("Slot not found");
    }
    const bookedSlot = await this.userRepository.findOneBookedSlotAndUpdate(
      { slotId },
      { consultation_status: "cancelled" }
    );

    if (!bookedSlot) {
      throw new Error("Booked slot not found");
    }
    const userId = bookedSlot.userId.toString();
    const user = await this.userRepository.findById(userId);
    if (!user) {
      throw new Error("User not found");
    }
    await this.userRepository.updateWallet(
      user._id.toString(),
      slot.bookingAmount
    );
    return { message: "Slot cancelled" };
  }
}

export default UserService;
