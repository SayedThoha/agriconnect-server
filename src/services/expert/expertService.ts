/* eslint-disable @typescript-eslint/no-empty-object-type */
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
import { IPrescription } from "../../models/prescriptionModel";
import { generateMailForRoomId } from "../../utils/sendRoomId";
import { INotification } from "../../models/notificationModel";

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

      // Check if expert is blocked
      if (expert.blocked === true) {
        return {
          success: false,
          statusCode: Http_Status_Codes.FORBIDDEN,
          message: "Your account is blocked by Admin",
        };
      }

      // Check if expert is verified
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
      // const accessToken = jwt.sign({ expertId: expert._id }, this.jwtSecret);
      const accessToken = generateAccessToken(expert._id);
      const refreshToken = generateRefreshToken(expert._id);
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

    // Send OTP
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
      // Send OTP
      const isOtpSent = await sentOtpToEmail(email, otp);

      if (!isOtpSent) {
        {
          // console.log("otp not send");
        }
      }
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
      // Validate refresh token
      const decodedRefreshToken = verifyRefreshToken(refreshToken); // This method will decode and validate the refresh token
      // console.log(decodedRefreshToken)
      if (!decodedRefreshToken) {
        return {
          success: false,
          statusCode: Http_Status_Codes.UNAUTHORIZED,
          message: "Invalid refresh token",
        };
      }

      // Find the user based on decoded token
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

      // Generate new access token and refresh token
      const newAccessToken = generateAccessToken(expert._id);
      // console.log("new accesstoken", newAccessToken);
      const newRefreshToken = generateRefreshToken(expert._id);
      // console.log("newRefresh token", newRefreshToken);
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

  //slot
  
  private convertToLocalDate(date: Date): Date {
    const utcDate = new Date(date);
    return new Date(utcDate.getTime() - utcDate.getTimezoneOffset() * 60000);
  }

 

  

 

 

  async getBookingDetails(expertId: string): Promise<IBookedSlot[]> {
    try {
      const bookings = await this.expertRepository.getBookingDetails(expertId);
      // console.log("booked slots:", bookings);
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

  async getUpcomingAppointment(expertId: string): Promise<IBookedSlot | {}> {
    // console.log("Fetching upcoming appointments...");

    const now = new Date();
    const margin = 15 * 60 * 1000; // 15 minutes in milliseconds

    const bookedSlots =
      await this.expertRepository.findPendingAppointmentsByExpert(expertId);
    // console.log("Booked Slots:", bookedSlots);

    // Filter appointments that are upcoming
    const upcomingAppointments = bookedSlots.filter((slot) => {
      if (
        !slot.slotId ||
        typeof slot.slotId !== "object" ||
        !("time" in slot.slotId)
      ) {
        console.error("Invalid slotId:", slot.slotId);
        return false;
      }

      const slotTime = new Date((slot.slotId as any).time);
      return slotTime.getTime() > now.getTime() - margin;
    });

    // Sort to get the nearest upcoming appointment
    upcomingAppointments.sort(
      (a, b) =>
        new Date((a.slotId as any).time).getTime() -
        new Date((b.slotId as any).time).getTime()
    );

    return upcomingAppointments[0] || {};
  }

  async updateUpcomingSlot(
    appointmentId: string,
    roomId: string
  ): Promise<IBookedSlot> {
    const data = await this.expertRepository.findSlotByIdAndUpdate(
      appointmentId,
      roomId
    );
    if (!data) {
      throw new Error("Appointment not found");
    }
    return data;
  }

  async updateSlotStatus(
    appointmentId: string,
    status: string
  ): Promise<IBookedSlot> {
    const data = await this.expertRepository.findSlotByIdAndUpdateStatus(
      appointmentId,
      status
    );
    if (!data) {
      throw new Error("Appointment not found");
    }
    return data;
  }

  async getExpertBookings(expertId: string): Promise<IBookedSlot[]> {
    // Validate input
    if (!expertId) {
      throw new Error("Expert ID is required");
    }

    try {
      // Find booked slots for the expert
      const slotIds = await this.expertRepository.findBookedSlotsByExpert(
        expertId
      );

      // console.log("slots to display in slot adding page:", slotIds.length);

      // If no slots, return empty array
      if (slotIds.length === 0) {
        return [];
      }

      // Find booked slots for these slots
      const bookedSlots = await this.expertRepository.findBookedSlotsBySlotIds(
        slotIds,
        expertId
      );

      // console.log("Booked slots:", bookedSlots.length);
      return bookedSlots;
    } catch (error) {
      console.error("Error in getDoctorBookings:", error);
      throw new Error("Failed to retrieve doctor bookings");
    }
  }

  async addPrescription(
    appointmentId: string,
    issue: string,
    prescription: string
  ): Promise<IPrescription> {
    // Validate input
    if (!appointmentId || !issue || !prescription) {
      throw new Error("Missing required fields");
    }

    try {
      // Verify the booked slot belongs to the expert
      const bookedSlot = await this.expertRepository.findBookedSlotById(
        appointmentId
      );

      if (!bookedSlot) {
        throw new Error("Appointment not found");
      }

      // Create prescription
      const newPrescription = await this.expertRepository.createPrescription({
        bookedSlot: appointmentId,
        issue,
        prescription,
      });

      // console.log("prescription:", newPrescription);

      // Update booked slot with prescription ID
      await this.expertRepository.updateBookedSlotWithPrescription(
        appointmentId,
        newPrescription._id as string
      );

      return newPrescription;
    } catch (error) {
      console.error("Error adding prescription:", error);
      throw new Error("Failed to add prescription");
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

  async getPrescriptionDetails(prescriptionId: string): Promise<IPrescription> {
    const data = await this.expertRepository.findPrescriptionById(
      prescriptionId
    );
    if (!data) {
      throw new Error("Prescription not found");
    }
    return data;
  }

  async getAllPrescriptions() {
    try {
      return await this.expertRepository.getPrescriptionsByExpert();
    } catch (error) {
      console.log(error);
    }
  }

  async getNotifications(expertId: string): Promise<INotification[]> {
    try {
      const notifications = await this.expertRepository.getNotifications(
        expertId
      );

      return notifications;
    } catch (error) {
      console.error("Error in notification service:", error);
      throw error;
    }
  }

  async markNotificationAsRead(expertId: string): Promise<void> {
    try {
      await this.expertRepository.markNotificationAsRead(expertId);
    } catch (error) {
      console.error("Error in notification service:", error);
      throw error;
    }
  }

  async clearNotifications(expertId: string): Promise<void> {
    try {
      await this.expertRepository.clearNotifications(expertId);
    } catch (error) {
      console.error("Error in clearing notifications (Service):", error);
      throw error;
    }
  }
}

export default ExpertService;
