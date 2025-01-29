/* eslint-disable  @typescript-eslint/no-explicit-any */

//userService.ts

// import jwt from "jsonwebtoken";
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

export type UserResponse = IUser | null;
export type UserResponeType = IUser | null | { success?: boolean };

class UserServices implements IUserService {
  private readonly OTP_EXPIRY_MINUTES = 59;
  
  constructor(private userRepository: UserRepository) {}

  async registerUser(userData: {
    firstName: string;
    lastName: string;
    email: string;
    password: string;
  }): Promise<any> {
    
    try {
      
      console.log("Registration service started for email:", userData.email);

      // Check if the user already exists
      const existingUser = await this.userRepository.emailExist(userData.email);
      console.log("Email existence check result:", existingUser);
      if (existingUser) {
        return { success: false, message: "Email already exists" };
      }

      // Hash password and generate OTP
      console.log("Reached password hashing...");
      const hashedPassword = await hashedPass(userData.password);
      console.log("Hashed Password:", hashedPassword);

      console.log("Generating OTP...");
      const otp = generateOtp();
      console.log("Generated OTP:", otp);

      // Create user data
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

      // Send OTP via email
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
      // Generate new OTP
      const otp = generateOtp();

      // Update user with new OTP
      const updatedUser = await this.userRepository.updateUserOtp(email, otp);

      if (!updatedUser) {
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
      const user = await this.userRepository.findUserByEmail(email);

      if (!user) {
        return {
          success: false,
          statusCode: Http_Status_Codes.NOT_FOUND,
          message: "User not found",
        };
      }

      // Verify OTP
      if (user.otp !== otp) {
        return {
          success: false,
          statusCode: Http_Status_Codes.UNAUTHORIZED,
          message: "Incorrect OTP",
        };
      }

      // Check OTP expiration
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

      console.log("Updating user verification status...");
      // Update user verification status
      const updatedUser = await this.userRepository.updateUserVerification(
        email,
        true,
        role ? newEmail : undefined
      );
      console.log("Updated user:", updatedUser);
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
      // Find user
      const user = await this.userRepository.findUserByEmail(email);

      if (!user) {
        return {
          success: false,
          statusCode: Http_Status_Codes.UNAUTHORIZED,
          message: "Invalid username",
        };
      }

      // Verify password
      const passwordMatch = await comparePass(password, user.password);
      if (!passwordMatch) {
        return {
          success: false,
          statusCode: Http_Status_Codes.UNAUTHORIZED,
          message: "Incorrect password",
        };
      }

      // Check if user is blocked
      if (user.blocked === true) {
        return {
          success: false,
          statusCode: Http_Status_Codes.FORBIDDEN,
          message: "Your account is blocked by Admin",
        };
      }

      // Check if user is verified
      if (user.is_verified === false) {
        // Generate and save new OTP
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
      // const accessToken = jwt.sign({ userId: user._id }, this.jwtSecret);
      const accessToken = generateAccessToken(user._id);

      const refreshToken = generateRefreshToken(user._id);
      // Create user object for response
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

    // Send OTP
    const isOtpSent = await sentOtpToEmail(email, otp);
    if (!isOtpSent) {
      return {
        success: false,
        statusCode: Http_Status_Codes.INTERNAL_SERVER_ERROR,
        message: "Failed to send OTP",
      };
    }
    // const otp = await generateMail(email);

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
      // Send OTP
      const isOtpSent = await sentOtpToEmail(email, otp);

      if (!isOtpSent) {
        {
          console.log("otp not send");
        }
      }
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
      // Validate refresh token
      const decodedRefreshToken = verifyRefreshToken(refreshToken); // This method will decode and validate the refresh token
      if (!decodedRefreshToken) {
        return {
          success: false,
          statusCode: Http_Status_Codes.UNAUTHORIZED,
          message: "Invalid refresh token",
        };
      }

      // Find the user based on decoded token
      const user = await this.userRepository.findUserById(
        decodedRefreshToken.userId
      );
      if (!user) {
        return {
          success: false,
          statusCode: Http_Status_Codes.NOT_FOUND,
          message: "User not found",
        };
      }

      // Generate new access token and refresh token
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
}

export default UserServices;
